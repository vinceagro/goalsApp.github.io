const input = document.querySelector('.input');

const addButton = document.querySelector('.newToDo');

const container = document.querySelector('.current-container')

const removeSelected = document.querySelector('.removeSelected')

const completedContainer = document.querySelector('.completed-container')

const deletedContainer = document.querySelector('.deleted-container')

const counter = document.querySelector('.counter');

const deletedElements = [];

const completedElements = [];

const createDiv = (className) => {
    const elementBox = document.createElement('div');
    elementBox.classList.add(className)
    return elementBox;
};

let today = new Date();

let currentMonth = today.getMonth();

let currentYear = today.getFullYear();



let monthAndYear = document.querySelector('.date');

let getDate = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let today = new Date()
    let numDay = today.getDate()
    let day = days[today.getDay()]
    let month = months[today.getMonth()]
    let hour = today.getTime()
    let year = today.getUTCFullYear()
    let myDate = `${day} ${numDay} ${month}&nbsp;${year}`;
    return myDate
}

let displayD = () => {
    document.querySelector('.date').innerHTML = getDate();
}
displayD()


class Element {

    id = null;
    name = null;
    container = null;
    completedContainer = null;
    deletedContainer = null;
    domReference = null;
    createdAt = null;
    deletedAt = null;
    completedAt = null;
    editedAt = null;
    isChecked = false;
    isEditable = false;
    permanentlyDel = false;
    totSelelcted = null;
    countdown = true;
    current_level = 864000;

    constructor(name, container, completedContainer, deletedContainer) {
        this.createdAt = new Date;
        this.id = Math.round(Math.random() * 10000)
        this.name = name;
        this.container = container;
        this.completedContainer = completedContainer;
        this.deletedContainer = deletedContainer
        this.domReference = this.getDOMElement()
    }
    getDOMElement() {
        let input = document.createElement('input');
        input.value = this.name;
        input.disabled = true;
        input.type = 'text';
        input.classList.add('inputElement')

        let i = document.createElement('i');

        const divButtons = createDiv('divButtons');
        const elementBox = createDiv('item');
        const divInput = createDiv('divInput');
        const countdown = createDiv('countdown');



        const checkbox = document.createElement('input');
        checkbox.classList.add('checkbox')
        checkbox.type = 'checkbox';
        checkbox.checked = false;

        const edit = document.createElement('button');
        edit.classList.add('buttons');
        edit.appendChild(i);
        edit.classList.add('fas', 'fa-edit')


        const remove = document.createElement('button');
        remove.classList.add('buttons')
        remove.appendChild(i);
        remove.classList.add('fas', 'fa-trash', 'item-trash')

        const completed = document.createElement('button');
        completed.classList.add('buttons', 'item-check');
        completed.appendChild(i);
        completed.classList.add('fas', 'fa-check');


        divButtons.appendChild(checkbox);
        divButtons.appendChild(edit);
        divButtons.appendChild(remove);
        divButtons.appendChild(completed);
        divButtons.appendChild(countdown);

        divInput.appendChild(input);
        elementBox.appendChild(divInput);
        elementBox.appendChild(divButtons);

        remove.addEventListener('click', () => this.setRemoved())
        checkbox.addEventListener('click', () => this.updateCheck())
        completed.addEventListener('click', () => this.setCompleted())
        edit.addEventListener('click', () => this.edit())


        return elementBox;

    }
    //NOT WORKING 
    timer() {
        if (this.deletedAt) return
        let days = Math.floor(this.current_level / 86400);
        let remainingDays = this.current_level - (days * 86400);
        let hours = Math.floor(remainingDays / 3600);
        let remainingHours = remainingDays - (hours * 3600);
        let minutes = Math.floor(remainingHours / 60);
        let remainingMinutes = remainingHours - (minutes * 60);
        let seconds = remainingMinutes;
        let countDown = this.domReference.querySelector('.countdown');
        countDown.textContent = days + "Days" + " " + hours + ":" + minutes + ":" + seconds;
        this.current_level--;
    }

    setRemoved() {
        let countDown = document.querySelector('.countdown')
        countDown.classList.add('none')
        if (this.deletedAt === null && this.completedAt === null && this.permanentlyDel === false) {
            this.deletedAt = new Date();
            this.moveTo(this.container, this.deletedContainer);
        } else if (this.completetAt !== null && this.permanentlyDel === false && this.deletedAt === null) {
            this.permanentlyDel = true;
            completedContainer.removeChild(this.domReference)
        } else if (this.completedAt === null && this.permanentlyDel === false && this.deletedAt !== null) {
            this.permanentlyDel = true;
            deletedContainer.removeChild(this.domReference)

        }
    }

    setCompleted() {
        let countDown = document.querySelector('.countdown')
        countDown.classList.add('none')
        countDown.innerHTML = ''
        this.completedAt = new Date()
        countDown.textContent = this.completedAt;
        this.moveTo(this.container, this.completedContainer)

    }

    moveTo(prevCont, nextCont) {
        prevCont.removeChild(this.domReference)
        nextCont.appendChild(this.domReference)
    }

    updateCheck() {
        // const check = this.isChecked; 
        this.isChecked = this.domReference.querySelector('input[type=checkbox]').checked;
    }

    edit() {
        this.editedAt = new Date();
        let myInput = this.domReference.querySelector('input');
        myInput.disabled = !myInput.disabled;
        myInput.classList.toggle('selected')
        myInput.select()
        this.name = myInput.value
    }


    render() {
        this.container.appendChild(this.domReference);

        let countdownTimer = setInterval(() => this.timer(),
            1000);
    }



}

class Manager {
    allElements = [];

    constructor(input) {
        this.input = input;
        addButton.addEventListener('click', () => this.newGoal());
        removeSelected.addEventListener('click', () => this.findSelected())
        window.addEventListener('keydown', (e) => {
            e.which === 13 ? this.newGoal() : e != 13
        });

        window.addEventListener('click', () => this.calcSelected())


    }

    newGoal(defaulName) {
        const name = defaulName ? defaulName : this.input.value;
        if (name === '') return;
        const newElement = new Element(name, container, completedContainer, deletedContainer)
        newElement.render();
        this.allElements.push(newElement)
        console.log(this.allElements)
        input.value = '';
        input.select();


    }

    findSelected() {
        let selected = this.allElements.filter(el => el.isChecked)
        for (let e of selected) {
            if (!e.permanentlyDel) {
                e.setRemoved()
            }

        }
    }

    calcSelected() {
        let count = 0;
        let numSelected = this.allElements.filter(el => el.isChecked && !el.permanentlyDel)
        count = numSelected.length;
        if (count >= 2) {
            removeSelected.classList.add('counterButton');
            counter.innerHTML = `${count} Elements selected`;
        } else if (count === 0) {
            removeSelected.classList.remove('counterButton');
            counter.innerHTML = '';
        } else {
            removeSelected.classList.add('counterButton');
            counter.innerHTML = `${count} Element selected`;
        }

    }
}



const listElement = new Manager(input, container, completedContainer, deletedContainer)
console.log(listElement)

const mapping = () => {
    listElement.allElements.map(el => {
        let newObj = {};
        newObj.name = el.name;
        newObj.createdAt = el.createdAt;
        newObj.completedAt = el.completedAt;
        newObj.deletedAt = el.deletedAt;
        localStorage.setItem('key', JSON.stringify(newObj));
    })
}