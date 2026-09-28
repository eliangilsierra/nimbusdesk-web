import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from './auth.model';

const TOKEN_STORAGE_KEY = 'nimbusdesk_token';

/**
 * Talks to nimbusdesk-identity-service through the gateway (/api/identity/auth/**,
 * public per ADR-0002) and keeps the issued JWT for the auth interceptor to attach
 * to every other request.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly email = signal<string | null>(localStorage.getItem('nimbusdesk_email'));

  readonly currentEmail = this.email.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/identity/auth/login`, request)
      .pipe(tap((response) => this.storeSession(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/identity/auth/register`, request)
      .pipe(tap((response) => this.storeSession(response)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('nimbusdesk_email');
    this.email.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem('nimbusdesk_email', response.email);
    this.email.set(response.email);
  }
}
