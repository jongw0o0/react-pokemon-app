package com.pokepoke.arch.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokepoke.arch.dto.MemberJoinDto;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/join")
    public ResponseEntity<Long> join(@RequestBody @Valid MemberJoinDto dto) {
        Long memberId = memberService.joinMember(dto);

        return ResponseEntity.ok(memberId);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberJoinDto dto, HttpServletRequest request) {

        try {

            // 서비스에서 아이디 비밀번호 검증 후 회원 정보 반환
            Member loginMember = memberService.login(dto.getLoginId(), dto.getPassword());
            
            // 스프링 시큐리티 인증용 토큰 생성
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getLoginId(), dto.getPassword());

            // 인증을 수행
            // 매니저가 토큰을 넘겨받아서 DB에서 조회, 비밀번호를 비교하도록 함
            Authentication authentication = authenticationManager.authenticate(authToken);

            // 시큐리티 컨텍스트에 인증 정보 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 인증 정보를 유지할 수 있도록 세션을 생성
            HttpSession session = request.getSession(true);

            // 세션에 저장
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // 로그인 성공에 대한 정보를 프론트로 전달
            return ResponseEntity.ok().body(Map.of(
                    "message", "환영합니다.",
                    "loginId", authentication.getName(),    // UserDetails.getUsername()의 리턴값
                    "userName", loginMember.getName(),      // 사용자 이름
                    "role", authentication.getAuthorities() // 로그인한 사용자의 권한 목록
                            .stream()                           // 시큐리티는 기본적으로 권한 목록을 객체로 관리
                                                                // 프론트에서 사용하기 쉽게 객체를 가공할 수 있도록 해줌
                            .map(a -> a.getAuthority())         // 객체에서 문자열을 꺼내어 저장
                            .toList()                           // 꺼내온 List로 변환하여 전달 List.of("ROLE_USER", "ROLE_ADMIN")
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of(
                    "message", "로그인 실패" + e.getMessage()
            ));
        }
    }

}
