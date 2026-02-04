package com.pokepoke.arch.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokepoke.arch.dto.DeckCreateDto;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.service.DeckService;
import com.pokepoke.arch.service.MemberService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DeckController {

    private final MemberService memberService;
    private final DeckService deckService;

    @PostMapping("/saveDeck")
    public ResponseEntity<?> saveDeck(@Valid @RequestBody DeckCreateDto dto, Principal principal) {
        try {
            // 로그인 여부 확인 후 회원 ID 추출
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }
            String loginId = principal.getName();
            
            // MemberService를 통해 로그인 아이디로 회원 PK(ID) 호출
            Member member = memberService.findByLoginId(loginId); 
            Long memberId = member.getId();

            // 서비스 호출
            Long savedDeckId = deckService.saveDeck(dto, memberId);
            return ResponseEntity.ok("덱 저장 성공! ID: " + savedDeckId);

        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그인 정보가 올바르지 않습니다.");
        }catch (Exception e) {
            e.printStackTrace(); // 에러 로그 확인용
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("저장 실패: " + e.getMessage());
        }
    }   

}
