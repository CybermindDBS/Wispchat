package com.cdev.wispchat.security;

import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.repository.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationCredentialsNotFoundException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        return getAuthenticatedUser(principal);
    }

    public User getAuthenticatedUser(Object principal) {
        if (principal instanceof OAuth2User oauth2User) {

            String userId = oauth2User.getAttribute("sub");
            if (userId == null)
                throw new AuthenticationCredentialsNotFoundException("User Id is null in OAuth2 principal");

            return userRepository.findById(userId)
                    .orElseThrow(() ->
                            new UsernameNotFoundException("User not found with id: " + userId));
        }

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {

            return userRepository.findById(userDetails.getUsername())
                    .orElseThrow(() ->
                            new UsernameNotFoundException("User not found with id: " + userDetails.getUsername()));
        }

        if (principal instanceof UsernamePasswordAuthenticationToken token) {
            return getAuthenticatedUser(token.getPrincipal());
        }

        if (principal instanceof OAuth2AuthenticationToken token) {
            return getAuthenticatedUser(token.getPrincipal());
        }

        if (principal == null) {
            throw new IllegalStateException("User not authenticated");
        }

        throw new AuthenticationCredentialsNotFoundException(
                "Unsupported principal type: " + principal.getClass()
        );
    }

    public boolean isCurrentUser(String userId) {
        return userId.equals(getAuthenticatedUser().getUserId());
    }
}

