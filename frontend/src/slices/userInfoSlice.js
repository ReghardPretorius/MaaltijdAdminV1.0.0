import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  surname: '',
  email: '',
  cellNumber: '',
  password: '',
  emailIsVerified:'',
  numberIsVerified:'',
  terms:'',
  userid:'',
  marketing:'',
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.name = action.payload;
    },
    updateSurname: (state, action) => {
        state.surname = action.payload;
      },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updateCellNumber: (state, action) => {
      state.cellNumber = action.payload;
    },
    updatePassword: (state, action) => {
        state.password = action.payload;
      },
      updateEmailIsVerified: (state, action) => {
        state.emailIsVerified = action.payload;
      },
      updateNumberIsVerified: (state, action) => {
        state.numberIsVerified = action.payload;
      },
      updateTerms: (state, action) => {
        state.terms = action.payload;
      },
      updateUserid: (state, action) => {
        state.userid = action.payload;
      },
    updateMarketing: (state, action) => {
      state.marketing = action.payload;
    },  
    resetAddress: (state) => {
      state.name = '';
      state.surname = '';
      state.email = '';
      state.cellNumber = '';
      state.password = '';
      state.emailIsVerified = '';
      state.numberIsVerified = '';
      state.terms= '';
      state.userid='';
      state.marketing = '';
    }
  }
});

export const { updateName, updateSurname, updateEmail, updateCellNumber, updatePassword, updateEmailIsVerified, updateNumberIsVerified, updateTerms, updateUserid, updateMarketing, resetUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;