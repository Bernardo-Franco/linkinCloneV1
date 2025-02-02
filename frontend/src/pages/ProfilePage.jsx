import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import ProfileHeader from '../components/ProfileHeader';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillSection from '../components/SkillSection';

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => await axiosInstance.get(`/users/${username}`),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put('/users/profile', updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser']);
      queryClient.invalidateQueries(['userProfile']);
    },
  });

  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser.username === userProfile.data.username;
  const userData = isOwnProfile ? authUser : userProfile.data;

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <AboutSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <ExperienceSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <EducationSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <SkillSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
    </div>
  );
};
export default ProfilePage;
