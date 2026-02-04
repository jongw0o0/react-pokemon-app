package com.pokepoke.arch.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokepoke.arch.dto.MemberJoinDto;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;    

    // 아이디로 회원 조회
    public Member findByLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));
    }

    // 회원가입
    public Long joinMember(MemberJoinDto dto) {
        checkMember(dto);
        Member member = Member.creatMember(dto, passwordEncoder);
        memberRepository.save(member);
        return member.getId();
    }

    // 로그인
    // MemberController에서 AuthenticationManager를 사용하는 방식으로 로그인 기능을 구현하였다면, MemberService.login 메서드는 더 이상 컨트롤러에서 직접 호출되지 않을 수도 있음
    public Member login(String loginId, String password) {
        // 아이디로 회원 조회
        Member member = findByLoginId(loginId);

        // 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    // 아이디, 이메일 중복 체크
    public void checkMember(MemberJoinDto dto){
        if(memberRepository.existsByLoginId(dto.getLoginId())) 
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        if(memberRepository.existsByEmail(dto.getEmail())) 
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
    }

}
