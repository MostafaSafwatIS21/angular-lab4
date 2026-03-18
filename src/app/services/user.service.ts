import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface User {
  id?: string;
  name: string;
  emial: string;
  avatar: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://ca10c8c14cfbfc5345d6.free.beeceptor.com/api/users';
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {
    console.log('UserService initialized with API URL:', this.apiUrl);
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    console.log('Creating user:', user);
    return this.http.post<User>(this.apiUrl, user, { headers: this.httpHeaders }).pipe(
      timeout(10000)
    );
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    console.log('Fetching all users from:', this.apiUrl);
    return this.http.get<User[]>(this.apiUrl, { headers: this.httpHeaders }).pipe(
      timeout(10000)
    );
  }

  // Get a single user
  getUserById(id: string): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching user from:', url);
    return this.http.get<User>(url, { headers: this.httpHeaders }).pipe(
      timeout(10000)
    );
  }

  // Update a user
  updateUser(id: string, user: User): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Updating user at:', url, user);
    return this.http.patch<User>(url, user, { headers: this.httpHeaders }).pipe(
      timeout(10000)
    );
  }

  // Delete a user
  deleteUser(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Deleting user from:', url);
    return this.http.delete<void>(url, { headers: this.httpHeaders }).pipe(
      timeout(10000)
    );
  }
}
