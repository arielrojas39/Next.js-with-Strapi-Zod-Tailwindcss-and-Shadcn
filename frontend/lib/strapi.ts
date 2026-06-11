// qs se encarga de convertir objetos JavaScript en cadenas de 
// consulta URL, lo que facilita la construcción de URLs con 
// parámetros complejos para las solicitudes a la API de Strapi.
// Tambien es necesario instalar pnpm install @types/qs -D para 
// que TypeScript reconozca los tipos de qs.
// import { cacheLife } from 'next/cache';

import qs from 'qs'

export const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://localhost:1337';

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"]
            },
            link: {
              populate: true
            }
          }
        }
      }
    }
  }
}

export async function getHomePage() {
//   f'use cache'

// Realizamos una prueba experimental de cache para almacenar temporalment
// la respuesta de Strapi y evitar hacer múltiples solicitudes en un corto período de tiempo.
// 'use cache';
// cacheLife({expire:300}); // Cachea la respuesta durante 5 minutos (300 segundos)
  const query = qs.stringify(QUERY_HOME_PAGE)
  const response = await getStrapiData(`/api/home-page?${query}`)
  return response?.data
}

export async function getStrapiData(url: string) {
  console.log('getStrapiData')

  try {
    const response = await fetch(`${STRAPI_BASE_URL}${url}`, {
      // headers: {
      //   Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      // },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
}

export async function registerUserService (userData: object) {
  const url = `${STRAPI_BASE_URL}/api/auth/local/register`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify (userData)
    })

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

export async function loginUserService (userData: object) {
  const url = `${STRAPI_BASE_URL}/api/auth/local`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error login user:', error)
    throw error
  }
}