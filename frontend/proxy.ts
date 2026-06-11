import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { STRAPI_BASE_URL } from "./lib/strapi"

// Rutas que queremos proteger, acceso solo a usuarios autenticados
const protectedRoutes = ['/dashboard']

// Funcion para cobrroborar si la ruta actual es una ruta protegida
function checkIsProtectedRoute(path: string) {
  return protectedRoutes.includes(path)
}

export async function proxy(request: NextRequest) {
    // obtenemos la ruta a la cual el usuario intenta acceder
  const currentPath = request.nextUrl.pathname

    // corroboramos si la ruta es una ruta protegida
  const isProtectedRoute = checkIsProtectedRoute(currentPath)

  // si no es una ruta protegida, dejamos pasar la solicitud sin verificar la autenticación del usuario
  if (!isProtectedRoute) return NextResponse.next()

  // por el contrario si la ruta, es una ruta protegida, debemos verificar si el usuario está autenticado
  try {
    // 1. validar si el usuario tiene el token jwt
    // 2. si el usuario existe en la base de datos
    // 3. si el usuario esta activo (Bloqueado?)

    // accedemos al almacenamiento de cookies para obtener el token jwt del usuario
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    // si no hay token jwt, redirigimos al usuario a la página de inicio de sesión
    if (!jwt) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    // si hay token jwt, hacemos una solicitud a la API de Strapi para verificar si el token es válido y obtener los datos del usuario
    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
        // /api/users/me es un endpoint protegido en Strapi que devuelve los datos del usuario autenticado, si el token jwt es válido. 
        // Si el token no es válido o ha expirado, Strapi devolverá un error de autenticación.
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }
    })

    // La respuesta de strapi es convertida a formato json para obtener los datos del usuario autenticado
    // caso contrario estara vacio o con un error de autenticación
    const userResponse = await response.json()
    console.log(userResponse)

    // Si strapi no devuelve datos del usuario autenticado, lo que significa que el token jwt no es válido o ha expirado,
    //  redirigimos al usuario a la página de inicio de sesión
    if (!userResponse) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    // Si llego hasta aca sin ser redirigido, significa que el usuario esta autenticado y tiene 
    // acceso a la ruta protegida, por lo tanto dejamos pasar la solicitud
    return NextResponse.next()

  }catch (error) {
    // Si ocurre un error durante el proceso de verificación de autenticación, redirigimos al usuario a la página de inicio de sesión
    console.error('Error verifying user authentication:', error)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}


// Configuración del middleware para que se ejecute en todas las rutas excepto las que comienzan 
// con /api, /_next/static, /_next/image y favicon.ico, y también en las rutas del dashboard
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
  ]
}

