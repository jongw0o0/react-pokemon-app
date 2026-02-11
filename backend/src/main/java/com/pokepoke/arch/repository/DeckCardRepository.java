package com.pokepoke.arch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokepoke.arch.entity.DeckCard;

public interface DeckCardRepository extends JpaRepository<DeckCard, Long> {

    List<DeckCard> findByDeckId(Long deckId);
}
