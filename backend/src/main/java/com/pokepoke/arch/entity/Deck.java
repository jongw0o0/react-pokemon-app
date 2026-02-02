package com.pokepoke.arch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@Table(name = "deck")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Deck {

    @Id
    @Column(name = "deck_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deckName;
    
    @Column(nullable = false)
    private String deckComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    public static Deck createDeck(String deckName, String deckComment, Member member) {
        Deck deck = new Deck();
        deck.deckName = deckName;
        deck.deckComment = deckComment;
        deck.member = member;
        return deck;
    }

}
