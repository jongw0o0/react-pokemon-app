package com.pokepoke.arch.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokepoke.arch.entity.Deck;

public interface DeckRepository extends JpaRepository<Deck, Long> {

}
