package com.pokepoke.arch.entity;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.pokepoke.arch.dto.MemberJoinDto;
import com.pokepoke.arch.constant.OAuthType;
import com.pokepoke.arch.constant.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString(exclude = "password") // 보안상 비밀번호는 toString에서 제외
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 10)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Lob
    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private OAuthType oAuthType;

    public static Member creatMember(MemberJoinDto dto, PasswordEncoder passwordEncoder) {
        Member member = new Member();
        member.loginId = dto.getLoginId();
        member.password = passwordEncoder.encode(dto.getPassword());
        member.name = dto.getName();
        member.email = dto.getEmail();
        member.address = dto.getAddress();
        member.role = Role.USER;
        return member;
    }

    // 소셜 로그인용
    public static Member createOAuthMember(String loginId, String nickname, String email, String password, OAuthType oauthType) {
        Member member = new Member();
        member.loginId = loginId;
        member.password = password;
        member.name = nickname;
        member.email = email;
        member.role = Role.USER;
        member.oAuthType = oauthType;

        return member;
    }

}
