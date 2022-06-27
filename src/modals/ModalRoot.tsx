import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Platform, ScrollView, View } from "react-native";
import Modal, { ModalProps } from "react-native-modal";

import { useModal, LogoutModal, ModalHeader, ModalView } from "@modals";
import { useNavigation } from "@react-navigation/native";

//
//  Name: Modal Root
//  Purpose: The root modal
//
export const ModalRoot = () => {
  const {
    currentView,
    replace: replaceCurrentView,
    pop: popCurrentView,
    hide,
    modalHeight,
    modalWidth,
    depth,
  } = useModal();

  // const navigation = useNavigation();

  // The props to pass to each view
  let modalProps = {};

  return (
    <Modal
      isVisible={currentView !== ModalView.HIDDEN}
      onBackdropPress={() => hide()}
    >
      <View style={{ height: modalHeight, width: modalWidth }}>
        {/*
         ***	The header of the modal.
         */}
        <ModalHeader />
        {/*
         ***	The available views of the modal.
         */}
        {/* {currentView === ShowCreateModalView.ADD_FRIENDS && (
          <CreateAddFriendsView {...modalProps} />
        )} */}
      </View>
      {/*
       ***	This is the close or back button for the modal.
       */}
      <View
	  	// style={ss(["abs", `ar_2`, "at_-2.5", "h_30", "w_30"])}
	  >
        {/* <TVIcon
          name={depth === 1 ? "CloseButtonSVG" : "BackArrowCircleSVG"}
          size={30}
          color={ss(["c_primary"]).color}
          callback={popCurrentView}
          customStyle={ss(["z_100"])}
        /> */}
      </View>
    </Modal>
  );
};
