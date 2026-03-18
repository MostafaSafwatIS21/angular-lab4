import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  showForm = false;
  showDetails = false;
  isEditing = false;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  formData: User = {
    name: '',
    emial: '',
    avatar: '',
    password: ''
  };

  constructor(private userService: UserService) {
    console.log('UserManagementComponent constructor');
  }

  ngOnInit(): void {
    console.log('ngOnInit - loading users');
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    console.log('%c➤ Fetching users...', 'color: blue; font-weight: bold;');

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log('%c✅ Users loaded:', 'color: green; font-weight: bold;', data);
        this.users = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('%c❌ Error:', 'color: red; font-weight: bold;', err);
        let msg = 'Failed to load users';
        if (err?.status === 0) msg += ': Network error';
        else if (err?.status) msg += `: HTTP ${err.status}`;
        this.error = msg;
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.formData = { name: '', emial: '', avatar: '', password: '' };
    this.showForm = true;
    this.showDetails = false;
  }

  createUser(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.error = null;

    this.userService.createUser(this.formData).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.successMessage = 'User created!';
        this.showForm = false;
        this.formData = { name: '', emial: '', avatar: '', password: '' };
        this.loading = false;
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        this.error = 'Failed to create user';
        this.loading = false;
      }
    });
  }

  viewUser(userId: string): void {
    this.loading = true;
    this.error = null;

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser = user;
        this.showDetails = true;
        this.showForm = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user';
        this.loading = false;
      }
    });
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.formData = { ...user };
    this.showForm = true;
    this.showDetails = false;
  }

  updateUser(): void {
    if (!this.formData.id || !this.validateForm()) return;

    this.loading = true;
    this.error = null;

    this.userService.updateUser(this.formData.id, this.formData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.successMessage = 'User updated!';
        this.showForm = false;
        this.loading = false;
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        this.error = 'Failed to update user';
        this.loading = false;
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Delete this user?')) {
      this.loading = true;
      this.error = null;

      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.successMessage = 'User deleted!';
          this.showDetails = false;
          this.loading = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete user';
          this.loading = false;
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.showDetails = false;
    this.selectedUser = null;
    this.formData = { name: '', emial: '', avatar: '', password: '' };
  }

  validateForm(): boolean {
    if (!this.formData.name?.trim() || !this.formData.emial?.trim() || !this.formData.avatar?.trim() || !this.formData.password?.trim()) {
      this.error = 'All fields required';
      return false;
    }
    if (!this.formData.emial.includes('@')) {
      this.error = 'Invalid email';
      return false;
    }
    return true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedUser = null;
  }
}
