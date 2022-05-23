//Открытие формы фильтрации при нажатии на соответсвующую кнопку
if(document.querySelector('.filter')) {
    let submitFilter = document.querySelector('.filter');
    let blockFilter = document.querySelector('.filter-content');
    let closeFilter = document.querySelector('.close-filter');
    let buttonSearch = document.querySelector('.icon-search');
    let formSearch = document.querySelector('.content-search');
    let inputSearch = document.querySelector('.input-search');

    submitFilter.addEventListener('click', () => {
        blockFilter.classList.toggle('filter-content_active');
    });

    closeFilter.addEventListener('click', () => {
        blockFilter.classList.toggle('filter-content_active');
    });

    //Вешаем слушателя на исконку поиска
    buttonSearch.addEventListener('click', (e) => {
            formSearch.submit();
    });

    setMaskSearch(inputSearch);

    function setMaskSearch(inputSearch) {
        let dateOptions = {
            mask: /^[а-яА-Я0-9 ]*$/,
            lazy: false
        };

        new IMask(inputSearch, dateOptions);
    }
}

//Выгрузка файла scv
if(document.querySelector('.button-scv')) {
    let cols = document.querySelectorAll('.table-permission__col.table-permission__id');
    let buttonSCV = document.querySelector('.button-scv');
    let inputSCV = document.querySelector('.input-scv');
    let listExcel = [];

    cols.forEach(e => {
        listExcel.push(e.innerHTML.trim());
    })

    buttonSCV.addEventListener('click', () => {
        let fl = true;

        listExcel.forEach(e => {
            if(fl) {
                fl = false;
                inputSCV.value = e;
            } else {
                inputSCV.value = inputSCV.value + " " + e;
            }
        });
    });
}

//Фиксирование строки таблицы
if(document.querySelector('.table-permission__row')) {
    let checkboxes = document.querySelectorAll('.input-choice-permission');
    let rows = document.querySelectorAll('.table-row');
    let cols = document.querySelectorAll('.col-check');
    let activeForms = [];
    let activeCheckbox;
    let countClicksOnOneCheckbox = 0;

    //Вешаем лисенеры на ячейку чекбокса
    rows.forEach(e => {
        addListenerForColChoice(e.querySelector('.input-choice'), '.input-choice')
    });

    checkboxes.forEach((e) => {
        e.addEventListener('click', (event) => {
            addListenerAddIdToForms(e, checkboxes)
            event.stopPropagation();
        });
    });

    cols.forEach((e) => {
        e.addEventListener('click', (event) => {
            addListenerAddIdToForms(e, cols)
        });
    });

    function addListenerAddIdToForms(e, elems) {
        elems.forEach(el => {
            if(e.querySelector('.input-choice')) {
                e = e.querySelector('.input-choice');
            }

            if(e.checked && e !== el) {
                el.checked = false;
            }
        });

        if(e.classList.contains('col-check')) {
            e = e.querySelector('.input-choice');
        }

        let idPermission = e.parentElement.parentElement.querySelector('.row-id').value;
        let inputsProcess = document.querySelectorAll('.row-id-process');
        let inputsIdPermissionForDispatcher = document.querySelectorAll('.permission-status__id');
        let color = e.parentElement.parentElement.previousElementSibling.value;

        //Перетекания айди разрешений в события править, создать на основе, удалить разрешение
        inputsProcess.forEach(input => {
            let buttonName = input.previousElementSibling.getAttribute('name');

            if(e.checked) {
                input.value = idPermission;
            } else {
                input.value = '';
            }
        })

        //Перетекания айди разрешений в события открыть, приостановить, закрыть разрешение
        inputsIdPermissionForDispatcher.forEach(input => {
            if(e.checked) {
                input.value = idPermission;
            } else {
                input.value = '';
            }
        })

        managementFormsFunc(color, e);
    }

    function hiddenActiveForms() {
        activeForms.forEach(e => {
            e.classList.add('hidden');
        });
    }

    function managementFormsFunc(color, e) {
        countClicksOnOneCheckbox++;

        if(activeCheckbox !== e) {
            countClicksOnOneCheckbox = 1;
            hiddenActiveForms(activeForms);
        }

        setActiveForms(color);

        if(countClicksOnOneCheckbox % 2 === 0) {
            hiddenActiveForms(activeForms);
        } else {
            showFormsFuncs();
        }

        activeCheckbox = e;
    }

    function setActiveForms(color) {
        let userRole = document.querySelector('.role').value;
        let formStoryPermission = document.getElementById('story-permission');

        if(color == 'violet') {
            let formEditPermission = document.getElementById('edit-permission');
            let formCreateByPermission = document.getElementById('create-by-permission');
            let formAgreementPermission = document.getElementById('agreement-permission');
            let formDelPermission = document.getElementById('del-permission');
            activeForms = [formStoryPermission, formEditPermission, formCreateByPermission, formAgreementPermission, formDelPermission];
        } else if(color == 'beige') {
            if(userRole === 'Диспетчер') {
                let formEditPermission = document.getElementById('edit-permission');
                activeForms = [formStoryPermission, formEditPermission];
            } else if(userRole === 'Автор') {
                let formApplyPermission = document.getElementById('apply-permission');
                let formCreateByPermission = document.getElementById('create-by-permission');
                let formCancelAgreementPermission = document.getElementById('cancel-agreement-permission');
                activeForms = [formStoryPermission, formApplyPermission, formCreateByPermission, formCancelAgreementPermission];
            }
        } else if(color == 'blue') {
            if(userRole === 'Диспетчер') {
                let formOpenPermission = document.getElementById('open-permission');
                let formClosePermission = document.getElementById('close-permission');
                let formActiveMaskingPermission = document.getElementById('activemasking-permission'); 
                activeForms = [formStoryPermission, formOpenPermission, formClosePermission, formActiveMaskingPermission];
            } else if(userRole === 'Автор') {
                let formEditPermission = document.getElementById('edit-permission');
                let formCancelApplyPermission = document.getElementById('cancel-apply-permission');
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formEditPermission, formCancelApplyPermission, formCreateByPermission];
            }
        } else if(color == 'red') {
            /* Требуется маскирование */
            if(userRole === 'Сменный инженер') {
                let formMaskingPermission = document.getElementById('masking-permission'); 
                activeForms = [formMaskingPermission, formStoryPermission];
            }  else if(userRole === 'Диспетчер') {
                let formOpenPermission = document.getElementById('open-permission');
                activeForms = [formStoryPermission, formOpenPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'brown') {
            /* Маскирование проведено */
            if(userRole === 'Проверяющий инженер') {
                let formMaskingPermission = document.getElementById('check_masking-permission'); 
                activeForms = [formMaskingPermission, formStoryPermission];
            } else if(userRole === 'Диспетчер') {
                let formOpenPermission = document.getElementById('open-permission');
                activeForms = [formStoryPermission, formOpenPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'purple') {
            if(userRole === 'Диспетчер') {
                let formOpenPermission = document.getElementById('open-permission');
                activeForms = [formStoryPermission, formOpenPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'green') {
            if(userRole === 'Диспетчер') {
                let formClosePermission = document.getElementById('close-permission');
                let formPausePermission = document.getElementById('pause-permission');
                let formActiveUnaskingPermission = document.getElementById('activeunmasking-permission'); 
                let formActiveMaskingPermission = document.getElementById('activemasking-permission'); 
                activeForms = [formStoryPermission, formClosePermission, formPausePermission, formActiveUnaskingPermission, formActiveMaskingPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'yellow') {
            if(userRole === 'Диспетчер') {
                let formClosePermission = document.getElementById('close-permission');
                let formOpenPermission = document.getElementById('open-permission');
                activeForms = [formStoryPermission, formClosePermission, formOpenPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        }   else if(color == 'gray') {
            if(userRole === 'Диспетчер') {
                let formActiveUnaskingPermission = document.getElementById('activeunmasking-permission');
                let completePermission =  document.getElementById('completed-permission');
                // let formRecoveryPermission = document.getElementById('recovery-permission');
                activeForms = [formStoryPermission, formActiveUnaskingPermission, completePermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'orange') {
            if(userRole === 'Сменный инженер') {
                let formUnmaskingPermission = document.getElementById('unmasking-permission'); 
                activeForms = [formUnmaskingPermission];
            } else if(userRole === 'Диспетчер') {
                let formClosePermission = document.getElementById('close-permission');
                let formRecoveryPermission = document.getElementById('recovery-permission');
                activeForms = [formStoryPermission, formRecoveryPermission, formClosePermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'lime') {
            if(userRole === 'Проверяющий инженер') {
                let formCheckUnmaskingPermission = document.getElementById('check_unmasking-permission'); 
                activeForms = [formCheckUnmaskingPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'darkgreen') {
            if(userRole === 'Диспетчер') {
                let formСompletePermission = document.getElementById('complete-permission');
                activeForms = [formStoryPermission, formСompletePermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        } else if(color == 'white') {
            if(userRole === 'Диспетчер') {
                let formRecoveryPermission = document.getElementById('recovery-permission');
                activeForms = [formStoryPermission, formRecoveryPermission];
            } else if(userRole === 'Автор') {
                let formCreateByPermission = document.getElementById('create-by-permission');
                activeForms = [formStoryPermission, formCreateByPermission];
            }
        }
    }

    function showFormsFuncs() {
        activeForms.forEach(e => {
           e.classList.remove('hidden');
        });
    }
}

//Работа с массивом статусов
if(document.querySelector('.filter-content__statuses')) {
    let inputStatutes = document.querySelector('.filter-content__statuses');
    let inputsStatus = document.querySelectorAll('.filter-content__status-id');
    let button = document.querySelector('.apply-filter');
    let statutes = [];

    inputsStatus.forEach(e => {
       if(e.getAttribute('checked') === 'checked') {
           statutes.push(e.getAttribute('id'));
       }

       e.addEventListener('change', () => {
           if(e.getAttribute('checked') === 'checked') {
               let count = 0;

               inputsStatus.forEach(e => {
                   if(e.getAttribute('checked') === 'checked') {
                       count++;
                   }
               });

               if(count > 1) {
                   e.setAttribute('checked', '');

                   let i = statutes.indexOf(e.getAttribute('id'));
                   statutes.splice(i, 1);
               } else {
                   e.checked = true;
               }
           } else {
               e.setAttribute('checked', 'checked');
               statutes.push(e.getAttribute('id'));
           }
       });
    });

    button.addEventListener('click', (event) => {
        let count = 1;
        statutes.forEach(e => {
            if(count === 1) {
                inputStatutes.value = e;
            } else {
                inputStatutes.value = inputStatutes.value + ' ' + e;
            }

            count++;
        });
    })
}

//Устанавливаем фон строкам таблицы разрешений
if(document.querySelector('.table-permission__background')) {
    let tablePermissionColors = document.querySelectorAll('.table-permission__background');

    tablePermissionColors.forEach(e => {
        let cols = e.nextElementSibling.querySelectorAll('.table-permission__col');

        if(e.value === 'violet') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_violet');
            })
        } else if(e.value === 'beige') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_beige');
            })
        } else if(e.value === 'blue') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_blue');
            })
        } else if(e.value === 'green') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_green');
            })
        } else if(e.value === 'yellow') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_yellow');
            })
        } else if(e.value === 'gray') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_gray');
            })
        }         
        /*      */
        else if(e.value === 'red') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_red');
            })
        } else if(e.value === 'brown') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_brown');
            })
        } else if(e.value === 'purple') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_purple');
            })
        } else if(e.value === 'orange') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_orange');
            })
        } else if(e.value === 'lime') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_lime');
            })
        } else if(e.value === 'darkgreen') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_darkgreen');
            })
        } else if(e.value === 'white') {
            cols.forEach(e => {
                e.classList.add('table-permission__col_white');
            })
        }
    });
}

//Всплытие окна фактического времени изменения статуса разрешения и комментарий для диспетчера
if(document.querySelector('.permission__block-button')) {
    let blocks = document.querySelectorAll('.permission__block-button');

    blocks.forEach(block => {
        let buttonOpenWindow = block.querySelector('.button-content');
        let window = block.querySelector('.permission-status');
        let buttonCancel = block.querySelector('.permission-status__cancel');
        let inputDate = block.querySelector('.permission-status__date');
        let inputTime = block.querySelector('.permission-status__time');

        buttonOpenWindow.addEventListener('click', e => {
            let permissionId = +block.querySelector('.permission-status__id').value;

            if(permissionId > 0) {
                hiddenWindows();
                toggleWindow(window);
            }
        });

        buttonCancel.addEventListener('click', () => {
            toggleWindow(window);
        });

        function toggleWindow(window) {
            let currentDate = new Date();
            let year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();
            let hour = currentDate.getHours();
            let minute = currentDate.getMinutes();

            month = setZero(month);
            day = setZero(day);
            hour = setZero(hour);
            minute = setZero(minute);

            inputDate.value = day +  "." + month + "." + year;
            inputTime.value = hour + ':' + minute;

            window.classList.toggle('permission-status_active');
        }

        function setZero(elem) {
            if(+elem < 10) {
                return '0' + elem;
            }

            return elem;
        }
    });
}

function hiddenWindows() {
    let windows = document.querySelectorAll('.permission-status');

    windows.forEach(e => {
        e.classList.remove('permission-status_active')
    });
}

//Пагинация
if(document.getElementById('num_page')) {
    let inputNumPage = document.getElementById('num_page');
    let inputsNumPages = document.querySelectorAll('.pagination__input');
    let formNumPagination = document.getElementById('form_num_page');

    inputsNumPages.forEach(e => {
        console.log(e)
        e.closest('.pagination__item').addEventListener('click', () => {
            inputNumPage.value = e.value;
            formNumPagination.submit();
        });
    })
}


if(document.querySelector('.masking-permission')){
    let buttonMaskingPermission = document.querySelector('.masking-permission');
    let formMasking = document.querySelector('.masking-submit');

    buttonMaskingPermission.addEventListener('click', () => {
        let forms = document.querySelectorAll('.masking-form');
        let currentId = document.querySelector('.row-id-process').value;

        forms.forEach((e) => {
            if(currentId == e.querySelector('.masking-text').value) {
                let button = e.closest('.masking-form').querySelector('.masking-submit');
                button.value = 'masking';
                button.click();
            }
        }) 
    });
}

if(document.querySelector('.unmasking-permission')){
    let buttonUnmaskingPermission = document.querySelector('.unmasking-permission');
    let formMasking = document.querySelectorAll('.masking-submit');
    formMasking.value = 'unmasking';

    buttonUnmaskingPermission.addEventListener('click', () => {
        let forms = document.querySelectorAll('.masking-form');
        let currentId = document.querySelector('.row-id-process').value;

        forms.forEach((e) => {
            if(currentId == e.querySelector('.masking-text').value) {
                let button = e.closest('.masking-form').querySelector('.masking-submit');
                button.value = 'unmasking';
                button.click();
            }
        }) 
    });
}

if(document.querySelector('.check_masking-permission')){
    let buttonCheckMaskingPermission = document.querySelector('.check_masking-permission');
    let formMasking = document.querySelector('.masking-submit');

    buttonCheckMaskingPermission.addEventListener('click', () => {
        let forms = document.querySelectorAll('.masking-form');
        let currentId = document.querySelector('.row-id-process').value;

        forms.forEach((e) => {
            if(currentId == e.querySelector('.masking-text').value) {
                let button = e.closest('.masking-form').querySelector('.masking-submit');
                button.value = 'check_masking';
                button.click();
            }
        }) 
    });
}

if(document.querySelector('.check_unmasking-permission')){
    let buttonCheckUnmaskingPermission = document.querySelector('.check_unmasking-permission');
    let formMasking = document.querySelector('.masking-submit');

    buttonCheckUnmaskingPermission.addEventListener('click', () => {
        let forms = document.querySelectorAll('.masking-form');
        let currentId = document.querySelector('.row-id-process').value;

        forms.forEach((e) => {
            if(currentId == e.querySelector('.masking-text').value) {
                let button = e.closest('.masking-form').querySelector('.masking-submit');
                button.value = 'check_unmasking';
                button.click();
            }
        }) 
    });
}