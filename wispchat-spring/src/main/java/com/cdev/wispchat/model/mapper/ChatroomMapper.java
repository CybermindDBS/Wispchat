package com.cdev.wispchat.model.mapper;

import com.cdev.wispchat.model.dto.ChatroomDTO;
import com.cdev.wispchat.model.entity.Chatroom;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChatroomMapper {
    ChatroomDTO toDto(Chatroom chatroom);
}
