import React, { useState, useEffect } from "react";
import "./cardRoom.css";

import {
  Grid,
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { TiCoffee } from "react-icons/ti";
import {
  EuiNotificationBadge,
  EuiAccordion,
  EuiPanel,
  EuiConfirmModal,
} from "@elastic/eui";
import FormEdit from "../../components/forms/formEdit";
import { useRoomsContext } from "../../context";
import { buscarHistoriaAberta } from "../../services/historias";
import GridOne from "./grids/gridOne";
import GridTwo from "./grids/gridTwo";

export default function CardRoom() {
  const [isEditModalVisible, setEditModal] = useState(false);
  const closeEditModal = () => setEditModal(false);
  const showEditModal = () => setEditModal(true);

  let editModal;

  async function toastEdit() {
    closeEditModal();

    toast("História Editada");
  }

  if (isEditModalVisible) {
    editModal = (
      <FormSample
        onClose={closeEditModal}
        modalHeader="Editar a História"
        modalBody={
          <FormControl id="room-name" isRequired>
            <FormLabel>Nome da História</FormLabel>
            <Input
              placeholder="Nome da História"
              onChange={(e) => console.log(e.target.value)}
            />
          </FormControl>
        }
        onClick={closeEditModal}
        onClickBtn={toastEdit}
        lBtnText="Sair"
        rBtnText="Criar"
      />
    );
  }

  const [isDeleteModalVisible, setDeleteModal] = useState(false);
  const closeDeleteModal = () => setDeleteModal(false);
  const showDeleteModal = () => setDeleteModal(true);

  let deleteModal;
  if (isDeleteModalVisible) {
    deleteModal = (
      <EuiConfirmModal
        title="Deletar a Sala"
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteClick}
        cancelButtonText="Sair"
        className="cancelText"
        confirmButtonText="Deletar"
        buttonColor="danger"
        defaultFocusedButton="confirm"
      >
        Você deseja apagar mesmo a sala?
      </EuiConfirmModal>
    );
  }

  function handleDeleteClick() {
    closeDeleteModal();

    toast("Sala deletada");
  }

  const [historias, setHistorias] = useState([
    { id: "", nome: "", emAberto: null },
  ]);

  const { usuario, sala } = useRoomsContext();

  const history = useHistory();

  useEffect(() => {
    if (!usuario.nome) {
      history.push("/");
    }
  }, []);

  useEffect(async () => {
    const res = await buscarHistoriaAberta(sala.id, "true");

    setHistorias(res);
  }, []);

  const buttonContent = (
    <Heading fontSize="2xl" fontFamily="Poppins" fontWeight="light">
      Convide os seus colegas
    </Heading>
  );

  return (
    <div className="grid">
      <Grid
        marginRight="5rem"
        templateColumns="1.75fr 1fr"
        gap={2}
        className="gridCustom"
      >
        <Box>
          <GridOne
            id={sala.id}
            historias={historias}
            deleteModal={deleteModal}
            editModal={editModal}
            showDeleteModal={showDeleteModal}
            showEditModal={showEditModal}
          />
        </Box>
        <GridTwo buttonContent={buttonContent} />
      </Grid>
    </div>
  );
}
