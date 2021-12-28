import React, { useState, createContext, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { buscarHistoriaAberta, serviceBuscarHistoria } from "../services/historias";
import { serviceBuscarSala } from "../services/salas";
import {
  serviceReiniciarVotacao,
  serviceFinalizarVotacao,
} from "../services/historias";
import poll from "easy-polling"
import { toast } from "react-toastify";

export const PokerContext = createContext();

const RoomsProvider = ({ children }) => {
  const [salas, setSalas] = useState([]);
  const [sala, setSala] = useState({
    nome: "",
    metodologias: { cartas: [] },
    jogadores: [],
    historias: [],
  });
  const [administrador, setAdministrador] = useState({ nome: "", email: "" });
  const [jogador, setJogador] = useState({ nome: "", email: "" });
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [usuario, setUsuario] = useState({ nome: "", email: "" });
  const [historias, setHistorias] = useState([]);
  const [historiaSelecionada, setHistoriaSelecionada] = useState()
  const [listaJogadoresVotos, setListaJogadoresVotos] = useState([])

  const history = useHistory();
  const location = useLocation();

  function limparContexto() {
    debugger
    setSala({
      nome: "",
      metodologias: { cartas: [] },
      jogadores: [],
      historias: [],
    });
    setSalas([])
    setTipoUsuario("");
    setJogador({ nome: "", email: "" });
    setAdministrador({ nome: "", email: "" });
    setUsuario({ nome: "", email: "" });
    setHistoriaSelecionada(null)
    setListaJogadoresVotos([])
  }

  function setLoginInContext(usuario, tipoUsuario){
    setTipoUsuario(tipoUsuario);
    setAdministrador(usuario);
    setUsuario(usuario);
  }

  function verificaTipoUsuarioNoStorage(){
    if (localStorage.getItem("tipoUsuario") == "administrador") {
      setLoginInContext(JSON.parse(localStorage.getItem("administrador")), "administrador");
    } else {
      setLoginInContext(JSON.parse(localStorage.getItem("jogador")), "jogador");
    }
  }

  useEffect(() => {
    if(salas && salas.jogadores)
     setListaJogadoresVotos(salas.jogadores)
  }, [sala])

  useEffect(() => {
    if (!location.pathname.includes("/jogador")) {
      if (!localStorage.getItem("tipoUsuario")) {
        history.push("/login");
      } else {
        verificaTipoUsuarioNoStorage()
      }
    }
  }, []);

  const executarPollingAtualizarSala = async(id) => {
    poll(
      async() => await serviceBuscarSala(id),
      (sala) => {
        setSala(sala)
        return !sala
      },
      2000, 
      600000
    )
  }

  const executarPollingAtualizarHistoriaSelecionada = async(id) => {
    poll(
      async() => await serviceBuscarHistoria(id),
      (historiaSelecionada) => {
        setHistoriaSelecionada(historiaSelecionada)
        return !sala
      },
      2000, 
      600000
    )
  }

  async function atualizarHistorias(idSala){
    const historias = await buscarHistoriaAberta(idSala, "true");
    setHistorias(historias);
    setHistoriaSelecionada(historias[0])
    await executarPollingAtualizarHistoriaSelecionada(historias[0]?.id)
  }

  const reiniciarVotacaoHistoriaSelecionada = async() => {
    await serviceReiniciarVotacao(historiaSelecionada.id) 
    toast.success("Votação reiniciada com sucesso")
  }

  const finalizarVotacaoHistoriaSelecionada = async() => {
    await serviceFinalizarVotacao(historiaSelecionada.id)
    toast.success("Votação finalizada com sucesso")
  }

  const states = { 
    administrador, 
    jogador, 
    salas, 
    sala, 
    tipoUsuario, 
    usuario, 
    historias, 
    historiaSelecionada,
    listaJogadoresVotos
  };

  const actions = {
    setAdministrador,
    setJogador,
    setSala,
    setSalas,
    setTipoUsuario,
    limparContexto,
    setLoginInContext,
    setHistoriaSelecionada,
    setHistorias,
    executarPollingAtualizarSala,
    executarPollingAtualizarHistoriaSelecionada,
    atualizarHistorias,
    reiniciarVotacaoHistoriaSelecionada,
    finalizarVotacaoHistoriaSelecionada,
    setListaJogadoresVotos
  };

  return (
    <>
      <PokerContext.Provider value={{ ...states, ...actions }}>
        {children}
      </PokerContext.Provider>
    </>
  );
};

export const useRoomsContext = () => {
  const context = useContext(PokerContext);
  return context;
};

export default RoomsProvider;
