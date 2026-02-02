package com.pokepoke.arch.repository;

import com.pokepoke.arch.entity.Member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // findBy... : DB에서 조건에 맞는 엔티티를 조회할 때 사용. 반환타입에 따라 다르게 동작
    // existsBy... : 조건에 맞는 데이터의 존재 여부만 확인. 반환타입 -> boolean
    //              select count(*) > 0 FROM member where loginId = "abc"

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    // 로그인 처리(비밀번호는 시큐리티가 알아서 처리)
    // Optional : null이 들어올 수도 있음을 타입으로 강제적으로 지정
    Optional<Member> findByLoginId(String loginId);
}
