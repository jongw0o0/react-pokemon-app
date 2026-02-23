package com.pokepoke.arch.controller;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pokepoke.arch.entity.CardLike;
import com.pokepoke.arch.repository.CardLikeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardLikeController {
    private final CardLikeRepository cardLikeRepository;

    @PostMapping("/like")
    public ResponseEntity<?> toggleLike(@RequestBody Map<String, Object> request) {
        Long memberId = Long.valueOf(request.get("memberId").toString());
        String cardId = (String) request.get("cardId");

        Optional<CardLike> existingLike = cardLikeRepository.findByMemberIdAndCardId(memberId, cardId);

        if (existingLike.isPresent()) {
            cardLikeRepository.delete(existingLike.get());
            return ResponseEntity.ok("UNLIKED");
        } else {
            CardLike newLike = new CardLike();
            newLike.setMemberId(memberId);
            newLike.setCardId(cardId);
            cardLikeRepository.save(newLike);
            return ResponseEntity.ok("LIKED");
        }
    }

    @GetMapping("/like/status")
    public ResponseEntity<Boolean> getLikeStatus(@RequestParam Long memberId, @RequestParam String cardId) {
        boolean isLiked = cardLikeRepository.findByMemberIdAndCardId(memberId, cardId).isPresent();
        return ResponseEntity.ok(isLiked);
    }
}