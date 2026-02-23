package com.pokepoke.arch.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokepoke.arch.dto.DeckInfoDto;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.service.DeckService;
import com.pokepoke.arch.service.MemberService;
import com.pokepoke.arch.service.ScrapService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/decks")
@RequiredArgsConstructor
public class ScrapController {

    private final ScrapService scrapService;
    private final MemberService memberService;
    private final DeckService deckService;

    @PostMapping("/{deckId}/scrap")
    public ResponseEntity<Boolean> scrapDeck(@PathVariable("deckId") Long deckId, Principal principal) {
        
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Member member = memberService.findByLoginId(principal.getName());
        Long memberId = member.getId();

        boolean isScrapped = scrapService.toggleScrap(memberId, deckId);
        
        return ResponseEntity.ok(isScrapped);
    }

    @GetMapping("/my-scraps")
    public ResponseEntity<List<DeckInfoDto>> getMyScrappedDecks(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        Member member = memberService.findByLoginId(principal.getName());
        List<DeckInfoDto> scrappedDecks = deckService.getScrappedDecks(member.getId());
        
        return ResponseEntity.ok(scrappedDecks);
    }
}
