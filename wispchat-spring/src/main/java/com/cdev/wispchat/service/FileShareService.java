package com.cdev.wispchat.service;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.entity.Message;
import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.model.entity.enums.ContentType;
import com.cdev.wispchat.model.entity.enums.Status;
import com.cdev.wispchat.model.mapper.MessageMapper;
import com.cdev.wispchat.security.CurrentUserProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class FileShareService {
    ChatEventService chatEventService;
    ChatroomService chatroomService;
    MessageService messageService;
    MessageMapper messageMapper;
    CurrentUserProvider currentUserProvider;

    FileShareService(ChatEventService chatEventService, ChatroomService chatroomService, MessageService messageService, MessageMapper messageMapper, CurrentUserProvider currentUserProvider) {
        this.chatEventService = chatEventService;
        this.chatroomService = chatroomService;
        this.messageService = messageService;
        this.messageMapper = messageMapper;
        this.currentUserProvider = currentUserProvider;
    }

    public void fileUpload(String chatroomId, MultipartFile file) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        chatroomService.assertMember(chatroomId, authenticatedUser.getUserId());

        if (file == null || file.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");

        File destinationFolder = new File("Files" + File.separator + chatroomId);
        boolean destinationFolderPresent = true;
        if (!destinationFolder.exists())
            destinationFolderPresent = destinationFolder.mkdirs();
        if (!destinationFolderPresent)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error code x01");

        long sizeInMB = (file.getSize() / (1024 * 1024));
        if (sizeInMB == 0) sizeInMB++;

        String originalName = Paths.get(file.getOriginalFilename())
                .getFileName()
                .toString();
        String extension = StringUtils.getFilenameExtension(originalName);
        String originalNameWithoutExtension = StringUtils.stripFilenameExtension(originalName);
        String safeName = originalNameWithoutExtension + "-" + UUID.randomUUID().toString().substring(0, 8)
                + (extension != null ? "." + extension : "");
        Path destinationFilePath = destinationFolder.toPath().resolve(safeName);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode json = objectMapper.createObjectNode();
        json.put("name", safeName);
        json.put("size", sizeInMB);

        EventDTO eventDTO = new EventDTO();
        eventDTO.setSenderId(authenticatedUser.getUserId());
        eventDTO.setSenderName(authenticatedUser.getName());
        eventDTO.setTimestamp(Instant.now());
        eventDTO.setChatroomId(chatroomId);
        eventDTO.setDeleted(false);
        eventDTO.setContentType(ContentType.EVENT_FILE_UPLOAD);
        eventDTO.setContent(json.toPrettyString());
        eventDTO.setStatus(Status.IN_PROGRESS);
        chatEventService.fileUpload(eventDTO);

        try {
            file.transferTo(destinationFilePath);
            eventDTO.setStatus(Status.COMPLETE);
            Message message = messageMapper.toEntity(eventDTO);
            message.setContentType(ContentType.FILE);
            messageService.save(message);
        } catch (IOException e) {
            eventDTO.setStatus(Status.FAILED);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error code x02");
        } finally {
            chatEventService.fileUpload(eventDTO);
        }
    }
}
