package com.pokepoke.arch.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pokepoke.arch.dto.DeckCreateDto;
import com.pokepoke.arch.dto.DeckDetailDto;
import com.pokepoke.arch.dto.DeckInfoDto;
import com.pokepoke.arch.entity.Deck;
import com.pokepoke.arch.entity.DeckCard;
import com.pokepoke.arch.entity.DeckScrap;
import com.pokepoke.arch.entity.Member;
import com.pokepoke.arch.mapper.DeckInfoMapper;
import com.pokepoke.arch.repository.DeckCardRepository;
import com.pokepoke.arch.repository.DeckRepository;
import com.pokepoke.arch.repository.DeckScrapRepository;
import com.pokepoke.arch.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true) 
@RequiredArgsConstructor
public class DeckService {

    private final DeckRepository deckRepository;
    private final DeckCardRepository deckCardRepository;
    private final MemberRepository memberRepository;
    private final DeckScrapRepository scrapRepository;

    private final DeckInfoMapper deckInfoMapper;

    // 덱 저장
    @Transactional
    public Long saveDeck(DeckCreateDto dto, Long memberId) {

        // 회원 정보 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 덱 엔티티 생성 및 저장
        Deck deck = Deck.createDeck(
                dto.getDeckName(),
                dto.getDeckComment(),
                dto.getRepresentativeCardId(),
                dto.getRepresentativeImageUrl(),
                dto.getIsPublic(),
                member);

        // 카드 ID 리스트를 순회하며 DeckCard 엔티티 생성 및 저장
        for (String cardId : dto.getApiCardIds()) {
            DeckCard deckCard = DeckCard.createDeckCard(deck, cardId);
            deckCardRepository.save(deckCard);

            // Deck 엔티티의 리스트에도 카드 추가
            deck.getDeckCards().add(deckCard);
        }

        deck.setFinalRepresentativeInfo();

        deckRepository.save(deck);
        return deck.getId();
    }

    @Transactional
    public void updateDeck(Long deckId, DeckCreateDto dto, Long memberId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 덱입니다."));

        // 권환 확인
        if (!deck.getMember().getId().equals(memberId)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }
    
        deck.updateDeck(
            dto.getDeckName(), 
            dto.getDeckComment(), 
            dto.getRepresentativeCardId(), 
            dto.getRepresentativeImageUrl(),
            dto.getIsPublic()
        );
    
        deck.getDeckCards().clear();

        for (String cardId : dto.getApiCardIds()) {
            DeckCard deckCard = DeckCard.createDeckCard(deck, cardId);
            deck.getDeckCards().add(deckCard);
        }

        deck.setFinalRepresentativeInfo();
    }

    @Transactional
    public void deleteDeck(Long deckId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 덱입니다."));
                
        deckRepository.delete(deck); 
    }

    // 모든 공개 덱 조회
    public List<DeckInfoDto> getAllPublicDecks() {
        List<Deck> decks = deckRepository.findAllPublicDecks();

        return decks.stream().map(deck -> {
            DeckInfoDto dto = deckInfoMapper.entityToDto(deck);
            dto.setScrapCount(scrapRepository.countByDeck(deck)); 
            return dto;
        }).collect(Collectors.toList());
    }

    // 특정 회원의 덱 조회
    // List<Deck>이 아니라 List<DeckInfoDto>를 반환 (매퍼 사용)
    public List<DeckInfoDto> getUserDeck(Long memberId) {
        // DB에서 엔티티 리스트 조회
        List<Deck> decks = deckRepository.findByMemberIdWithMember(memberId);

        // 매퍼를 사용하여 엔티티 -> DTO 변환
        return decks.stream()
                .map(deckInfoMapper::entityToDto)
                .collect(Collectors.toList());
    }

    // 특정 유저가 스크랩한 덱 목록 조회
    public List<DeckInfoDto> getScrappedDecks(Long memberId) {
        // memberId로 DeckScrap 테이블에서 해당 유저의 데이터들 조회
        // 조회된 DeckScrap에서 Deck 엔티티만 추출하여 DTO로 변환
        List<DeckScrap> scraps = scrapRepository.findByMemberId(memberId);
        
        return scraps.stream()
                .map(scrap -> deckInfoMapper.entityToDto(scrap.getDeck()))
                .collect(Collectors.toList());
    }

    @Transactional
    public DeckDetailDto getDeckDetail(Long deckId, Long currentMemberId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 덱입니다."));

        deck.addViews();

        List<DeckCard> deckCards = deckCardRepository.findByDeckId(deckId);
        List<String> apiCardIds = deckCards.stream()
                .map(DeckCard::getApiCardId)
                .collect(Collectors.toList());

        // DeckDetailDto dto = new DeckDetailDto();
        // dto.setDeckName(deck.getDeckName());
        // dto.setDeckComment(deck.getDeckComment());
        // dto.setUserName(deck.getMember().getName());
        // dto.setApiCardIds(apiCardIds);
        // dto.setRepresentativeCardId(deck.getRepresentativeCardId());
        // dto.setRepresentativeImageUrl(deck.getRepresentativeImageUrl());

        // return dto;

        // 매퍼 사용
        DeckDetailDto dto = deckInfoMapper.entityToDetailDto(deck, apiCardIds);

        if (currentMemberId != null) {
        boolean isScrapped = scrapRepository.existsByMemberIdAndDeckId(currentMemberId, deckId);
        dto.setScrapped(isScrapped);
    } else {
        dto.setScrapped(false);
    }

        return dto;
    }

}
