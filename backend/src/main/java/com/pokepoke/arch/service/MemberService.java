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

    public Long joinMember(MemberJoinDto dto) {
        checkMember(dto);
        Member member = Member.creatMember(dto, passwordEncoder);
        memberRepository.save(member);
        return member.getId();
    }

    public Member login(String loginId, String password) {
        // 아이디로 회원 조회
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalStateException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }


    public void checkMember(MemberJoinDto dto){
        if(memberRepository.existsByLoginId(dto.getLoginId())) 
            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
        if(memberRepository.existsByEmail(dto.getEmail())) 
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
    }

}
