package com.pokepoke.arch.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokepoke.arch.dto.DeckCreateDto;
import com.pokepoke.arch.entity.Deck;
import com.pokepoke.arch.entity.DeckCard;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.repository.DeckCardRepository;
import com.pokepoke.arch.repository.DeckRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SaveDeckService {

    private final DeckRepository deckRepository;
    private final DeckCardRepository deckCardRepository;

    public Long saveDeck(DeckCreateDto dto, Member member) {

        // 덱 엔티티 생성 및 저장
        Deck deck = Deck.createDeck(dto.getDeckName(), dto.getDeckComment(), member);
        deckRepository.save(deck);

        // 카드 ID 리스트를 순회하며 DeckCard 엔티티 생성 및 저장
        for (String cardId : dto.getApiCardIds()) {
            DeckCard deckCard = DeckCard.createDeckCard(deck, cardId);
            deckCardRepository.save(deckCard);
        }

        return deck.getId();
    }

}