import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import { Team, TeamCreate, TeamUpdate, TeamWithUsers } from '@/types';

/**
 * Service for handling team-related API calls.
 */
export const teamService = {
  /**
   * Fetches all teams the user has access to.
   * @returns {Promise<Team[]>} Promise resolving to an array of teams.
   */
  getTeams: (): Promise<Team[]> => {
    return apiClient.get(API_ENDPOINTS.teams.base);
  },

  /**
   * Fetches a specific team by its ID, including user data.
   * @param {number} id - The ID of the team to retrieve.
   * @returns {Promise<TeamWithUsers>} Promise resolving to the team with users.
   */
  getTeamById: (id: number): Promise<TeamWithUsers> => {
    return apiClient.get(API_ENDPOINTS.teams.get(id));
  },

  /**
   * Creates a new team.
   * @param {TeamCreate} data - The data for the new team.
   * @returns {Promise<Team>} Promise resolving to the created team.
   */
  createTeam: (data: TeamCreate): Promise<Team> => {
    return apiClient.post(API_ENDPOINTS.teams.base, data);
  },

  /**
   * Updates an existing team.
   * @param {number} id - The ID of the team to update.
   * @param {TeamUpdate} data - The updated data.
   * @returns {Promise<Team>} Promise resolving to the updated team.
   */
  updateTeam: (id: number, data: TeamUpdate): Promise<Team> => {
    return apiClient.put(API_ENDPOINTS.teams.update(id), data);
  },

  /**
   * Deletes a team by ID.
   * @param {number} id - The ID of the team to delete.
   * @returns {Promise<Team>} Promise resolving to the deleted team data.
   */
  deleteTeam: (id: number): Promise<Team> => {
    return apiClient.delete(API_ENDPOINTS.teams.delete(id));
  },

  /**
   * Adds a user to a team by email address.
   * @param {number} teamId - The ID of the team to add the user to.
   * @param {string} userEmail - The email of the user to add.
   * @returns {Promise<void>} Promise resolving when the user is added.
   */
  addTeamMember: (teamId: number, userEmail: string): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.teams.addMember(teamId, userEmail), {});
  },

  /**
   * Removes a user from a team.
   * @param {number} teamId - The ID of the team to remove the user from.
   * @param {number} userId - The ID of the user to remove.
   * @returns {Promise<void>} Promise resolving when the user is removed.
   */
  removeTeamMember: (teamId: number, userId: number): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.teams.removeMember(teamId, userId));
  },
};
