package com.pokepoke.arch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pokepoke.arch.entity.Deck;

public interface DeckRepository extends JpaRepository<Deck, Long> {

    // Member 정보를 한 번에 가져오도록 fetch join 적용
    @Query("select d from Deck d join fetch d.member")  
    List<Deck> findAllWithMember();

    @Query("SELECT d FROM Deck d WHERE d.isPublic = 'Y' AND d.isDeleted = 'N'")
    List<Deck> findAllPublicDecks();

    @Query("select d from Deck d join fetch d.member where d.member.id = :memberId")
    List<Deck> findByMemberIdWithMember(@Param("memberId") Long memberId);

}
