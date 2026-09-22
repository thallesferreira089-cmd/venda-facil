import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'secret-key-venda-facil-12345';
const key = new TextEncoder().encode(secretKey);

export interface SessionData {
  userId: string;
  storeId: string;
  email: string;
  name?: string;
}

export async function createSession(data: SessionData) {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    return payload as unknown as SessionData;
  } catch (error) {
    // Se o token for inválido, expirado ou der erro de leitura, limpa a sessão sem derrubar o servidor
    return null;
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  } catch (error) {
    console.error('Erro ao destruir sessão:', error);
  }
}