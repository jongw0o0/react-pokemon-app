package com.pokepoke.arch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pokepoke.arch.entity.Deck;
import com.pokepoke.arch.entity.DeckScrap;
import com.pokepoke.arch.entity.Member;

public interface DeckScrapRepository extends JpaRepository<DeckScrap, Long> {
    
    // 특정 회원이 특정 덱을 이미 스크랩했는지 확인
    Optional<DeckScrap> findByMemberAndDeck(Member member, Deck deck);
    
    // 특정 회원이 특정 덱을 이미 스크랩했는지 ID로 확인
    boolean existsByMemberIdAndDeckId(Long memberId, Long deckId);
    
    // 유저 ID로 스크랩 리스트 가져오기
    @Query("SELECT ds FROM DeckScrap ds JOIN FETCH ds.deck WHERE ds.member.id = :memberId")
    List<DeckScrap> findByMemberId(@Param("memberId") Long memberId);
    
    long countByDeck(Deck deck);
    
}
