# Configuración de Firebase para la lista de regalos

## 1. Crear el proyecto
1. Entra a https://console.firebase.google.com
2. Crea un proyecto nuevo.
3. En el panel principal, agrega una app web.</n
## 2. Copiar las credenciales
Firebase te mostrará un bloque parecido a este:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Pega esos valores en `script.js`, reemplazando los campos que empiezan con `REEMPLAZAR_`.

## 3. Activar Firestore Database
1. Ve a **Build > Firestore Database**.
2. Clic en **Create database**.
3. Selecciona modo **Production** si ya vas a publicar, o **Test** solo para pruebas rápidas.
4. Elige una ubicación cercana.

## 4. Crear la colección `gifts`
Crea una colección llamada `gifts` y agrega estos documentos manualmente.

### Documento 1
ID: `aporte-libre`
- nombre: `Aporte libre`
- descripcion: `Aporte voluntario para un regalo especial.`
- icono: `💚`
- reservado: `false`
- nombre_invitado: ``

### Documento 2
ID: `carros-pistas`
- nombre: `Carros o pistas`
- descripcion: `Vehículos o accesorios para juego de movimiento.`
- icono: `🚗`
- reservado: `false`
- nombre_invitado: ``

### Documento 3
ID: `dino-figuras`
- nombre: `Figuras de dinosaurios`
- descripcion: `Set de dinosaurios o figura grande temática.`
- icono: `🦖`
- reservado: `false`
- nombre_invitado: ``

### Documento 4
ID: `libro-infantil`
- nombre: `Libro infantil`
- descripcion: `Cuentos ilustrados o libros interactivos.`
- icono: `📚`
- reservado: `false`
- nombre_invitado: ``

### Documento 5
ID: `ropa-talla-6`
- nombre: `Ropa talla 6`
- descripcion: `Camiseta, pijama o conjunto cómodo.`
- icono: `👕`
- reservado: `false`
- nombre_invitado: ``

### Documento 6
ID: `zapatos-30`
- nombre: `Zapatos talla 30`
- descripcion: `Tenis o sandalias para niño.`
- icono: `👟`
- reservado: `false`
- nombre_invitado: ``

## 5. Reglas recomendadas de Firestore
Usa estas reglas básicas para permitir lectura pública y reserva controlada.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gifts/{giftId} {
      allow read: if true;
      allow update: if true
        && request.resource.data.diff(resource.data).changedKeys().hasOnly([
          'reservado',
          'nombre_invitado',
          'reservado_en'
        ])
        && resource.data.reservado == false
        && request.resource.data.reservado == true
        && request.resource.data.nombre_invitado is string
        && request.resource.data.nombre_invitado.size() >= 2;
      allow create: if false;
      allow delete: if false;
    }
  }
}
```

## 6. Publicar cambios
1. Guarda los cambios en GitHub.
2. Espera a que GitHub Pages se actualice.
3. Abre la página en modo incógnito para evitar caché.

## 7. Verificación rápida
- Si ves la lista con botón **Reservar**, Firebase está conectado.
- Si ves el mensaje **Firebase aún no está configurado**, falta pegar las credenciales en `script.js`.
