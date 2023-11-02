import { IRole } from "@src/database/models/role.model";
import { User } from "../database/models/user.model";
import { GuildMember, Role } from "discord.js";

/**
 * Updates the roles of a guild member based on their best role.
 * 
 * @param member The guild member whose roles are to be updated.
 * 
 * This function retrieves the user associated with the guild member from the database, 
 * populates their role, and then checks if their current role is not their best role. 
 * If it isn't, the function retrieves the new and old roles from the guild, 
 * removes the old role from the member, adds the new role to the member, 
 * and updates the user's role in the database.
 */
export const updateRoles = async (member: GuildMember) => {
    User.findOne({ id: member.id })
        .populate<{ role: IRole }>("role")
        .orFail()
        .then(async (user) => {
            const bestRole = await user.getBestRole();

            if (user.role && bestRole !== null) {
                if (user.role.id !== bestRole.id) {
                    const newRole: Role | undefined = member.guild.roles.cache.get(bestRole?.id);
                    const oldRole: Role | undefined = member.guild.roles.cache.get(user.role?.id);

                    if (!newRole || !oldRole) return;

                    await member.roles.remove(user.role.id);
                    await member.roles.add(newRole!);
                    await user.setRole(bestRole);
                }
            }
        });
}