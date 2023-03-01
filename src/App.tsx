import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:3002", { autoConnect: false });
// const socket = io().connect("http://localhost:3002");

type ServerMessage = {
    isLogged: boolean;
};

function App() {
    const [isSocketConnected, setIsSocketConnected] = useState(
        socket.connected
    );
    const [dataFromServer, setDataFromServer] = useState<ServerMessage | null>(
        null
    );

    useEffect(() => {
        // escuta pelo evento de conectado no servidor
        socket.on("connect", () => {
            setIsSocketConnected(true);
        });

        // escuta pelo evento de disconectado do servidor
        socket.on("disconnect", () => {
            setIsSocketConnected(false);
        });

        // escuta por mensagem recebidas do servidor do tipo "is-logged-message"
        socket.on("is-logged-message", (data) => {
            setDataFromServer(JSON.parse(data));
        });

        return () => {
            // aqui a gente limpa os estados do socket,
            // pois nesse ponto, o componente App não existe mais
            // foi destruido por algum motivo ou deu lugar à outro componente.
            socket.off("connect");
            socket.off("disconnect");
            socket.off("is-logged-message");
        };
    }, []);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
    }, []);

    return (
        <div className="App">
            <div>
                Socket está conectado: {isSocketConnected ? "SIM" : "NÃO"}
            </div>
            <div>
                Mensagem recebida do servidor:{" "}
                {dataFromServer?.isLogged ? "LOGADO" : "DESLOGADO"}
            </div>
            <div>
                <p>
                    <strong>
                        De acordo com a mensagem recebida do servidor, se pode
                        efetuar alguma ação. Mostrar uma imagem, mudar de tela,
                        etc.
                    </strong>
                </p>
            </div>
        </div>
    );
}

export default App;
