import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { User } from '../../../common/interfaces';

const bcryptRounds = 10;

export function getUsers(): User[] {
    const data: string = fs.readFileSync('./config/users.json', 'utf-8');
    return JSON.parse(data);
}

export function setUsers(users: User[]): void {
    for (const user of users) {
        if (user.password) {
            user.passwordHash = bcrypt.hashSync(user.password, bcryptRounds);
            delete user.password;
        }
    }
    fs.writeFileSync('./config/users.json', JSON.stringify(users), 'utf-8');
}