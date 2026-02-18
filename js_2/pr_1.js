let expenses = [];

function addExpense(title, amount, category) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
        console.log('Ошибка: название не может быть пустым');
        return null;
    }
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        console.log('Ошибка: сумма должна быть положительным числом');
        return null;
    }
    
    if (!category || typeof category !== 'string' || category.trim() === '') {
        console.log('Ошибка: категория не может быть пустой');
        return null;
    }
    
    const id = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    
    const newExpense = {
        id: id,
        title: title.trim(),
        amount: amount,
        category: category.trim()
    };
    
    expenses.push(newExpense);
    console.log(`✅ Расход добавлен: ${title} - ${amount} руб. (${category})`);
    return newExpense;
}

function printAllExpenses() {
    if (expenses.length === 0) {
        console.log('📭 Список расходов пуст');
        return;
    }
    
    console.log('\n📋 ВСЕ РАСХОДЫ:');
    console.log('────────────────────');
    
    expenses.forEach(exp => {
        console.log(`ID: ${exp.id} | ${exp.title} | ${exp.amount} руб. | ${exp.category}`);
    });
    
    console.log('────────────────────');
    console.log(`💰 Всего операций: ${expenses.length}`);
    console.log(`💵 Общая сумма: ${getTotalAmount()} руб.\n`);
}

function getTotalAmount() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    console.log(`💳 ОБЩИЙ БАЛАНС: ${total} руб.`);
    return total;
}

function getExpensesByCategory(category) {
    if (!category || typeof category !== 'string') {
        console.log('Ошибка: укажите категорию');
        return [];
    }
    
    const filtered = expenses.filter(exp => 
        exp.category.toLowerCase() === category.toLowerCase().trim()
    );
    
    const totalByCategory = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    
    console.log(`\n📁 КАТЕГОРИЯ: ${category}`);
    console.log('────────────────────');
    
    if (filtered.length === 0) {
        console.log('❌ Расходов в этой категории нет');
    } else {
        filtered.forEach(exp => {
            console.log(`${exp.title} | ${exp.amount} руб. | ID: ${exp.id}`);
        });
        console.log('────────────────────');
        console.log(`📊 Всего расходов: ${filtered.length}`);
        console.log(`💰 Сумма по категории: ${totalByCategory} руб.\n`);
    }
    
    return filtered;
}

function findExpenseByTitle(searchString) {
    if (!searchString || typeof searchString !== 'string') {
        console.log('Ошибка: введите строку для поиска');
        return null;
    }
    
    const found = expenses.find(exp => 
        exp.title.toLowerCase().includes(searchString.toLowerCase().trim())
    );
    
    if (found) {
        console.log(`\n🔍 НАЙДЕН РАСХОД:`);
        console.log(`ID: ${found.id} | ${found.title} | ${found.amount} руб. | ${found.category}`);
        
        const additionalNote = prompt('Добавить дополнительную строку к расходу? (оставьте пустым, если нет)');
        if (additionalNote && additionalNote.trim() !== '') {
            found.title = found.title + ' (' + additionalNote.trim() + ')';
            console.log(`✅ Дополнительная строка добавлена: "${found.title}"`);
        }
    } else {
        console.log(`❌ Расход с названием, содержащим "${searchString}", не найден`);
    }
    
    return found;
}

const expenseTracker = {
    expenses: expenses,
    
    addExpense: function(title, amount, category) {
        return addExpense(title, amount, category);
    },
    
    getTotalAmount: function() {
        return getTotalAmount();
    },
    
    getExpensesByCategory: function(category) {
        return getExpensesByCategory(category);
    },
    
    findExpenseByTitle: function(searchString) {
        return findExpenseByTitle(searchString);
    },
    
    deleteExpenseById: function(id) {
        if (!id || typeof id !== 'number') {
            console.log('Ошибка: укажите корректный ID');
            return false;
        }
        
        const index = this.expenses.findIndex(exp => exp.id === id);
        
        if (index === -1) {
            console.log(`❌ Расход с ID ${id} не найден`);
            return false;
        }
        
        const deleted = this.expenses[index];
        this.expenses.splice(index, 1);
        console.log(`🗑️ Расход удалён: ${deleted.title} | ${deleted.amount} руб. | ID: ${id}`);
        return true;
    },
    
    getCategoryStatistics: function() {
        const stats = {};
        
        this.expenses.forEach(exp => {
            if (!stats[exp.category]) {
                stats[exp.category] = {
                    count: 0,
                    total: 0,
                    average: 0
                };
            }
            stats[exp.category].count++;
            stats[exp.category].total += exp.amount;
        });
        
        for (let cat in stats) {
            stats[cat].average = stats[cat].total / stats[cat].count;
        }
        
        console.log('\n📊 СТАТИСТИКА ПО КАТЕГОРИЯМ:');
        console.log('────────────────────────────');
        
        if (Object.keys(stats).length === 0) {
            console.log('❌ Нет данных для статистики');
        } else {
            for (let cat in stats) {
                console.log(`📁 ${cat}:`);
                console.log(`   Расходов: ${stats[cat].count}`);
                console.log(`   Сумма: ${stats[cat].total} руб.`);
                console.log(`   Средний чек: ${stats[cat].average.toFixed(2)} руб.`);
            }
        }
        
        console.log('────────────────────────────\n');
        return stats;
    },
    
    validateInput: function(title, amount, category) {
        const errors = [];
        
        if (!title || typeof title !== 'string' || title.trim() === '') {
            errors.push('Название не может быть пустым');
        }
        
        if (!amount || typeof amount !== 'number') {
            errors.push('Сумма должна быть числом');
        } else if (amount <= 0) {
            errors.push('Сумма должна быть положительным числом');
        }
        
        if (!category || typeof category !== 'string' || category.trim() === '') {
            errors.push('Категория не может быть пустой');
        }
        
        if (errors.length > 0) {
            console.log('\n❌ ОШИБКИ ВВОДА:');
            errors.forEach((err, index) => {
                console.log(`${index + 1}. ${err}`);
            });
            console.log('');
            return false;
        }
        
        return true;
    }
};

expenses = expenseTracker.expenses;

console.log('💸 ПЕРСОНАЛЬНЫЙ ТРЕКЕР РАСХОДОВ');
console.log('================================\n');

addExpense('Кофе', 250, 'Еда');
addExpense('Метро', 65, 'Транспорт');
addExpense('Обед', 450, 'Еда');
addExpense('Такси', 500, 'Транспорт');
addExpense('Кино', 600, 'Развлечения');

printAllExpenses();

getTotalAmount();

getExpensesByCategory('Еда');
getExpensesByCategory('Транспорт');

findExpenseByTitle('Кофе');

expenseTracker.deleteExpenseById(2);

expenseTracker.getCategoryStatistics();

console.log('Проверка некорректного ввода:');
expenseTracker.validateInput('', -100, '');
expenseTracker.validateInput('Хлеб', 'не число', 'Еда');