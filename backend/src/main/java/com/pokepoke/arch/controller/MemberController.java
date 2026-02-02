package com.pokepoke.arch.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/join")
    public ResponseEntity<Long> join(@RequestBody @Valid MemberJoinDto dto) {
        Long memberId = memberService.joinMember(dto);

        return ResponseEntity.ok(memberId);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberJoinDto dto, HttpServletRequest request) {

        try {
            // 서비스에서 아이디 비밀번호 검증
            Member loginMember = memberService.login(dto.getLoginId(), dto.getPassword());

            // 로그인 성공 시 세션 생성 (기존 세션 있으면 반환, 없으면 신규 생성)
            HttpSession session = request.getSession();
            session.setAttribute("loginMember", loginMember.getLoginId());

            return ResponseEntity.ok(loginMember.getName() + "님 환영합니다!");

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
