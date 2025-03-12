# Equilibre

![Logo](./src/assets/adaptive-icon.png)

## Descrição

O **Equilibre** é um aplicativo desenvolvido  para ajudar pessoas  a organizarem suas tarefas diárias, registrar suas emoções e criar notas de áudio. Este aplicativo é uma ferramenta poderosa para gerenciar o dia a dia de forma mais eficiente e personalizada.

## Funcionalidades

- **Registro de Emoções**: Permite registrar como você está se sentindo em diferentes momentos do dia.
- **Lista de Tarefas**: Ajuda a organizar e gerenciar suas tarefas diárias.
- **Notas de Áudio**: Permite gravar e armazenar notas de áudio para referência futura.
- **Informações**: Seção sobre o aplicativo e o desenvolvedor.

## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Navigation](https://reactnavigation.org/)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)

## Capturas de Tela

### Registro de Emoções
![Registro de Emoções](./screenshots/emotion-tracker.png)

### Lista de Tarefas
![Lista de Tarefas](./screenshots/task-list.png)

### Notas de Áudio
![Notas de Áudio](./screenshots/audio-notes.png)

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/equilibre.git
    cd equilibre
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

3. Inicie o aplicativo:
    ```sh
    npm start
    ```

## Construir APK

Para construir um APK Android, siga os passos abaixo:

1. Instale o EAS CLI:
    ```sh
    npm install -g eas-cli
    ```

2. Configure o EAS:
    ```sh
    eas build:configure
    ```

3. Autentique-se no Expo:
    ```sh
    expo login
    ```

4. Crie o APK:
    ```sh
    eas build -p android --profile preview
    ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença 0BSD. Veja o arquivo LICENSE para mais detalhes.

## Contato

Desenvolvido por phaleixo 

