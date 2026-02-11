package com.pokepoke.arch.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokepoke.arch.dto.DeckCreateDto;
import com.pokepoke.arch.dto.DeckDetailDto;
import com.pokepoke.arch.dto.DeckInfoDto;
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
            // 로그인 여부 확인
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            // MemberService를 통해 로그인 아이디로 회원 PK(ID) 호출
            Member member = memberService.findByLoginId(principal.getName());
            Long memberId = member.getId();

            // 서비스 호출
            Long savedDeckId = deckService.saveDeck(dto, memberId);
            return ResponseEntity.ok("덱 저장 성공! ID: " + savedDeckId);

        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그인 정보가 올바르지 않습니다.");
        } catch (Exception e) {
            e.printStackTrace(); // 에러 로그 확인용
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("저장 실패: " + e.getMessage());
        }
    }

    // 모든 유저가 올린 전체 덱 조회
    @GetMapping("/decks")
    public ResponseEntity<List<DeckInfoDto>> getAllDecks() {
        return ResponseEntity.ok(deckService.getAllPublicDecks());
    }

    @GetMapping("/decks/me")
    public ResponseEntity<?> getMyDecks(Principal principal) {
        // 로그인 여부 확인
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            Member member = memberService.findByLoginId(principal.getName());
            // 서비스 호출 deckService.getUserDeck(매퍼 사용)
            List<DeckInfoDto> decks = deckService.getUserDeck(member.getId());

            return ResponseEntity.ok(decks);

        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그인 정보가 올바르지 않습니다.");
        } catch (Exception e) {
            e.printStackTrace(); // 에러 로그 확인용
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("덱 조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/decks/{deckId}")
    public ResponseEntity<?> getDeckDetail(@PathVariable("deckId") Long deckId) {
        try {
            DeckDetailDto deckDetail = deckService.getDeckDetail(deckId);
            return ResponseEntity.ok(deckDetail);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회 실패: " + e.getMessage());
        }
    }

}
