package com.cdev.wispchat.security;

import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.repository.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest request) {
        OidcUser oidcUser = super.loadUser(request);

        String googleId = oidcUser.getSubject();
        String name = oidcUser.getFullName();

        User user = userRepository.findById(googleId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserId(googleId);
                    newUser.setName(name);
                    newUser.setProvider("GOOGLE");
                    return userRepository.save(newUser);
                });

        System.out.println("New user created: " + user);

        return oidcUser;
    }
}
