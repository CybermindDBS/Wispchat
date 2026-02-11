package com.cdev.wispchat.model.mapper;

import com.cdev.wispchat.model.dto.MemberDTO;
import com.cdev.wispchat.model.entity.Member;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    MemberDTO toDto(Member member);
}