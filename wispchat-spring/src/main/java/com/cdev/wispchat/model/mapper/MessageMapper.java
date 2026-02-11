package com.cdev.wispchat.model.mapper;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(target = "messageId", ignore = true)
    Message toEntity(EventDTO eventDTO);

    @Mapping(target = "id", source = "messageId")
    @Mapping(target = "senderName", ignore = true)
    @Mapping(target = "status", ignore = true)
    EventDTO toDto(Message message);
}
