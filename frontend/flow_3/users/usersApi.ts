import { CreateUserDto } from "./CreatedUsersDto";

export class UsersAPI {
    static baseUrl = 'http://127.0.0.1:3000/auth/'

    static async login(userDto: CreateUserDto) {
    //   console.log("calling " + UsersAPI.baseUrl);
      const response = await fetch(UsersAPI.baseUrl + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      const data = await response.json();
      return data;
    }

    static async signup(userDto: CreateUserDto) {
      const response = await fetch(UsersAPI.baseUrl + 'signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      const data = await response.json();
      return data;
    }
}