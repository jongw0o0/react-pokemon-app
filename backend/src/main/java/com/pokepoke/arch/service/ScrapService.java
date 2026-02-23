package com.pokepoke.arch.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pokepoke.arch.entity.Deck;
import com.pokepoke.arch.entity.DeckScrap;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.repository.DeckRepository;
import com.pokepoke.arch.repository.DeckScrapRepository;
import com.pokepoke.arch.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScrapService {

    private final DeckScrapRepository scrapRepository;
    private final MemberRepository memberRepository;
    private final DeckRepository deckRepository;

    @Transactional
    public boolean toggleScrap(Long memberId, Long deckId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        Deck deck = deckRepository.findById(deckId).orElseThrow();

        Optional<DeckScrap> existingScrap = scrapRepository.findByMemberAndDeck(member, deck);

        if (existingScrap.isPresent()) {
            scrapRepository.delete(existingScrap.get());
            return false;
        } else {
            scrapRepository.save(new DeckScrap(member, deck));
            return true;
        }
    }
}
