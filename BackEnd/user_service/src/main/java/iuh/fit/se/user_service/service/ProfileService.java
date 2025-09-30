package iuh.fit.se.user_service.service;


import iuh.fit.se.user_service.dto.ProfileDto;
import iuh.fit.se.user_service.dto.ProfileRequest;
import iuh.fit.se.user_service.model.Profile;

import java.util.List;

public interface ProfileService {
    Profile getMyProfile(Long userId);
    Profile updateProfile(Long id, ProfileDto profileDto);
    Profile createProfile(ProfileRequest request);
    void deleteProfile(Long id);
    public List<Profile> getAllMyProfiles();
}
