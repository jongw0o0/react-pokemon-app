package com.pokepoke.arch.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.pokepoke.arch.dto.DeckDetailDto;
import com.pokepoke.arch.dto.DeckInfoDto;
import com.pokepoke.arch.entity.Deck;

@Mapper(componentModel = "spring")
public interface DeckInfoMapper {

    // Deck 엔티티의 member 필드 안에 있는 name을 DeckInfoDto의 userName 필드로 매핑
    @Mapping(source = "id", target = "deckId")    
    @Mapping(source = "member.name", target = "userName")
    @Mapping(source = "representativeImageUrl", target = "representativeImageUrl")
    @Mapping(source = "representativeCardId", target = "representativeCardId")
    DeckInfoDto entityToDto(Deck deck);

    // 상세 조회용 매핑 추가
    @Mapping(source = "deck.member.name", target = "userName") // 작성자 이름
    @Mapping(source = "apiCardIds", target = "apiCardIds")     // 파라미터로 받은 리스트 매핑
    DeckDetailDto entityToDetailDto(Deck deck, List<String> apiCardIds);
}
