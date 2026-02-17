
import { Exercise, Difficulty, ProgrammingLanguage, Category } from './types';

export const SAMPLE_EXERCISES: Exercise[] = [
  // --- JUNIOR / FÁCIL ---
  {
    id: 'py-001',
    title: 'Variables y Tipos',
    description: 'Aprende a declarar variables y usar f-strings en Python.',
    difficulty: Difficulty.EASY,
    category: Category.LOGIC,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea una variable `nombre` con tu nombre.\n2. Crea una variable `edad` con un número entero.\n3. Imprime "Hola, me llamo {nombre} y tengo {edad} años" usando f-string.',
    initialCode: '# Escribe tu código aquí\n\n',
    hints: ['Usa f"{variable}" para interpolar', 'print() es la función para mostrar texto']
  },
  {
    id: 'py-002',
    title: 'Calculadora Simple',
    description: 'Operaciones matemáticas básicas y entrada de datos.',
    difficulty: Difficulty.EASY,
    category: Category.LOGIC,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Define dos variables `a` y `b` con valores 10 y 5.\n2. Imprime la suma, resta, multiplicación y división, una por línea.',
    initialCode: 'a = 10\nb = 5\n# Tu código aquí',
    hints: ['Usa +, -, *, /']
  },
  {
    id: 'py-003',
    title: 'Condicionales: Par o Impar',
    description: 'Uso de if/else y operador módulo.',
    difficulty: Difficulty.EASY,
    category: Category.CONDITIONALS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea una función `es_par(n)` que retorne `True` si n es par y `False` si es impar.\n2. Prueba la función con el número 7.',
    initialCode: 'def es_par(n):\n    # Tu lógica\n    pass',
    hints: ['n % 2 == 0 verifica si es par']
  },
  {
    id: 'py-010',
    title: 'Mayor de Edad',
    description: 'Verificación básica con condicionales.',
    difficulty: Difficulty.EASY,
    category: Category.CONDITIONALS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea una función `verificar_edad(edad)`.\n2. Si edad >= 18, retorna "Es mayor de edad".\n3. Si no, retorna "Es menor de edad".',
    initialCode: 'def verificar_edad(edad):\n    pass',
    hints: ['Usa if edad >= 18:', 'Recuerda indentar el código']
  },
  {
    id: 'py-011',
    title: 'Calificación de Notas',
    description: 'Uso de condicionales anidados o múltiples.',
    difficulty: Difficulty.EASY,
    category: Category.CONDITIONALS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `calificar(nota)`.\n2. Si nota >= 90 -> "A"\n3. Si nota >= 80 -> "B"\n4. Si nota >= 70 -> "C"\n5. Menor a 70 -> "F"',
    initialCode: 'def calificar(nota):\n    pass',
    hints: ['Usa if, elif y else']
  },
  {
    id: 'py-015',
    title: 'Suma de N Números',
    description: 'Introducción a bucles.',
    difficulty: Difficulty.EASY,
    category: Category.LOOPS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `sumar_hasta(n)`.\n2. Suma todos los números de 1 hasta n usando un ciclo for o while.\n3. Retorna la suma total.',
    initialCode: 'def sumar_hasta(n):\n    suma = 0\n    # Tu bucle\n    return suma',
    hints: ['Usa `range(1, n + 1)`', 'Acumula en la variable suma']
  },
  {
    id: 'py-016',
    title: 'Tabla de Multiplicar',
    description: 'Bucles e impresión formateada.',
    difficulty: Difficulty.EASY,
    category: Category.LOOPS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `tabla_del(n)`.\n2. Imprime la tabla del n del 1 al 10.\n3. Ejemplo: "5 x 1 = 5"',
    initialCode: 'def tabla_del(n):\n    pass',
    hints: ['Itera 1 a 10', 'Usa f-strings para imprimir']
  },
  {
    id: 'py-020',
    title: 'Lista de Compras',
    description: 'Manipulación básica de listas.',
    difficulty: Difficulty.EASY,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea una lista `compras` vacía.\n2. Agrega "Manzanas" y "Leche".\n3. Elimina "Manzanas".\n4. Retorna la lista final.',
    initialCode: 'compras = []\n# Métodos append() y remove()',
    hints: ['append("item")', 'remove("item")']
  },
  {
    id: 'py-021',
    title: 'Invertir Lista',
    description: 'Algoritmos básicos sobre listas.',
    difficulty: Difficulty.EASY,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `invertir_lista(lista)`.\n2. Retorna una nueva lista con los elementos al revés.\n3. Intenta no usar `reverse()`.',
    initialCode: 'def invertir_lista(lista):\n    return lista[::-1] # ¿Conoces otra forma?',
    hints: ['Slicing [::-1] es lo más pythonico', 'También puedes usar un bucle']
  },
  {
    id: 'py-025',
    title: 'Conversor Celsius a Fahrenheit',
    description: 'Fórmulas matemáticas simples.',
    difficulty: Difficulty.EASY,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `c_a_f(celsius)`.\n2. Fórmula: (celsius * 9/5) + 32.\n3. Retorna el resultado.',
    initialCode: 'def c_a_f(celsius):\n    pass',
    hints: ['Cuidado con el orden de operaciones']
  },
  {
    id: 'py-026',
    title: 'Área de un Círculo',
    description: 'Uso de módulos y matemática.',
    difficulty: Difficulty.EASY,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Importa `math`.\n2. Función `area_circulo(radio)`.\n3. Retorna pi * radio al cuadrado.',
    initialCode: 'import math\n\ndef area_circulo(radio):\n    pass',
    hints: ['math.pi', 'radio ** 2']
  },

  // --- MID / MEDIO ---
  {
    id: 'py-004',
    title: 'Palíndromo (Algoritmo)',
    description: 'Manipulación de strings y lógica intermedia.',
    difficulty: Difficulty.MEDIUM,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea una función `es_palindromo(texto)`.\n2. Debe normalizar el texto (minusculas, sin espacios).\n3. Retorna true si se lee igual al revés.',
    initialCode: 'def es_palindromo(texto):\n    pass\n\n# print(es_palindromo("Anita lava la tina"))',
    hints: ['texto.lower().replace(" ", "")', 'Slicing [::-1] invierte un string']
  },
  {
    id: 'py-005',
    title: 'FizzBuzz',
    description: 'El clásico ejercicio de entrevista.',
    difficulty: Difficulty.MEDIUM,
    category: Category.LOOPS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Imprime números del 1 al 20.\n2. Si es múltiplo de 3, imprime "Fizz".\n3. Si es múltiplo de 5, imprime "Buzz".\n4. Si es de ambos, imprime "FizzBuzz".',
    initialCode: '# FizzBuzz loop\nfor i in range(1, 21):\n    pass',
    hints: ['Verifica i % 15 == 0 primero', 'Usa elif para las otras condiciones']
  },
  {
    id: 'py-006',
    title: 'Gestor de Tareas',
    description: 'Manipulación de diccionarios y listas.',
    difficulty: Difficulty.MEDIUM,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea una lista de diccionarios `tareas`.\n2. Cada tarea tiene "id", "titulo" y "completada".\n3. Crea una función `completar_tarea(id)` que marque true en completada.',
    initialCode: 'tareas = [\n    {"id": 1, "titulo": "Aprender Python", "completada": False}\n]\n\ndef completar_tarea(id_tarea):\n    pass',
    hints: ['Itera la lista con un for', 'Si tarea["id"] coincide, modifica el valor']
  },
  {
    id: 'py-012',
    title: 'Año Bisiesto',
    description: 'Lógica condicional compleja.',
    difficulty: Difficulty.MEDIUM,
    category: Category.CONDITIONALS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `es_bisiesto(year)`.\n2. Es bisiesto si es divisible por 4.\n3. NO es bisiesto si es divisible por 100, a menos que también sea divisible por 400.',
    initialCode: 'def es_bisiesto(year):\n    pass',
    hints: ['Usa (year % 4 == 0 and year % 100 != 0) or ...']
  },
  {
    id: 'py-013',
    title: 'Calculadora de Descuentos',
    description: 'Lógica de negocio simple.',
    difficulty: Difficulty.MEDIUM,
    category: Category.CONDITIONALS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `calcular_precio(precio, tipo_cliente)`.\n2. "VIP" -> 20% descuento.\n3. "Frecuente" -> 10% descuento.\n4. Otro -> 0%. Retorna precio final.',
    initialCode: 'def calcular_precio(precio, tipo_cliente):\n    pass',
    hints: ['precio * 0.8 para 20% descuento']
  },
  {
    id: 'py-017',
    title: 'Factorial',
    description: 'Bucles y acumuladores.',
    difficulty: Difficulty.MEDIUM,
    category: Category.LOOPS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `factorial(n)`.\n2. Calcula el producto de 1 a n.\n3. Ejemplo: 5! = 120.',
    initialCode: 'def factorial(n):\n    res = 1\n    # tu código\n    return res',
    hints: ['range(1, n + 1)', 'Multiplica res *= i']
  },
  {
    id: 'py-018',
    title: 'Contador de Vocales',
    description: 'Iteración sobre strings.',
    difficulty: Difficulty.MEDIUM,
    category: Category.LOOPS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `contar_vocales(texto)`.\n2. Retorna cuántas vocales (aeiou) tiene el texto.\n3. Ignora mayúsculas/minúsculas.',
    initialCode: 'def contar_vocales(texto):\n    pass',
    hints: ['texto.lower()', 'if char in "aeiou":']
  },
  {
    id: 'py-022',
    title: 'Diccionario de Coder',
    description: 'Manejo de estructuras anidadas.',
    difficulty: Difficulty.MEDIUM,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Coder es un dict con `nombre` y `notas` (lista).\n2. Función `promedio(Coder)`.\n3. Retorna el promedio de sus notas.',
    initialCode: 'est = {"nombre": "Ana", "notas": [90, 80, 85]}\n\ndef promedio(Coder):\n    pass',
    hints: ['sum(lista) / len(lista)']
  },
  {
    id: 'py-023',
    title: 'Frecuencia de Palabras',
    description: 'Algoritmo de conteo con dicts.',
    difficulty: Difficulty.MEDIUM,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `frecuencia(texto)`.\n2. Separa por espacios y cuenta cada palabra.\n3. Retorna un diccionario {palabra: cantidad}.',
    initialCode: 'def frecuencia(texto):\n    palabras = texto.split()\n    conteo = {}\n    # tu código\n    return conteo',
    hints: ['if palabra in conteo:', 'conteo[palabra] += 1']
  },
  {
    id: 'py-027',
    title: 'Búsqueda Lineal',
    description: 'Implementación de algoritmo básico.',
    difficulty: Difficulty.MEDIUM,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `buscar(lista, objetivo)`.\n2. Recorre la lista.\n3. Retorna el índice del objetivo, o -1 si no existe.',
    initialCode: 'def buscar(lista, objetivo):\n    for i, val in enumerate(lista):\n        # check\n    return -1',
    hints: ['enumerate() te da índice y valor']
  },

  // --- SENIOR / DIFÍCIL ---
  {
    id: 'py-007',
    title: 'Decorador de Tiempo',
    description: 'Metaprogramación básica con decoradores.',
    difficulty: Difficulty.HARD,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Crea un decorador `@time_execution`.\n2. Debe medir el tiempo que tarda una función en ejecutarse.\n3. Imprime "Tiempo: X segundos".',
    initialCode: 'import time\n\ndef time_execution(func):\n    def wrapper(*args, **kwargs):\n        # Implementar lógica\n        return func(*args, **kwargs)\n    return wrapper\n\n@time_execution\ndef proceso_lento():\n    time.sleep(1)',
    hints: ['Usa time.time() antes y después de llamar a func']
  },
  {
    id: 'py-008',
    title: 'Validación de Paréntesis',
    description: 'Uso de pilas para validación de estructura.',
    difficulty: Difficulty.HARD,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Valida si una cadena de paréntesis `()[]{}` está bien balanceada.\n2. Usa una lista como pila (stack).\n3. Retorna True o False.',
    initialCode: 'def validar_parentesis(s):\n    stack = []\n    mapa = {")": "(", "}": "{", "]": "["}\n    # Tu código',
    hints: ['Si es apertura, push al stack', 'Si es cierre, pop y comparar']
  },
  {
    id: 'py-009',
    title: 'Sistema de Banco',
    description: 'POO avanzado con propiedades y métodos privados.',
    difficulty: Difficulty.HARD,
    category: Category.LOGIC,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Clase `Cuenta` con atributo privado `__saldo`.\n2. Propiedad `saldo` (getter) que retorne el valor.\n3. Método `retirar` que lance excepción `ValueError` si no hay fondos.',
    initialCode: 'class Cuenta:\n    def __init__(self, saldo_inicial):\n        self.__saldo = saldo_inicial\n\n    # Implementar getter y métodos',
    hints: ['Usar decorador @property', 'raise ValueError("mensaje")']
  },
  {
    id: 'py-014',
    title: 'Validador de Contraseña',
    description: 'Lógica compleja de validación.',
    difficulty: Difficulty.HARD,
    category: Category.CONDITIONALS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `validar_pass(password)`.\n2. Debe tener > 8 caracteres.\n3. Debe tener al menos una mayúscula y un número.\n4. Retorna True o False.',
    initialCode: 'def validar_pass(password):\n    # Tu código\n    pass',
    hints: ['any(char.isupper() for char in password)', 'any(char.isdigit() ...)']
  },
  {
    id: 'py-019',
    title: 'Números Primos',
    description: 'Optimización de bucles.',
    difficulty: Difficulty.HARD,
    category: Category.LOOPS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `es_primo(n)`.\n2. Retorna True si n es primo, False si no.\n3. Optimiza: no verifiques pares si > 2, o hasta raíz de n.',
    initialCode: 'def es_primo(n):\n    if n < 2: return False\n    # tu optimización',
    hints: ['Bucle hasta int(n**0.5) + 1']
  },
  {
    id: 'py-024',
    title: 'Matriz Transpuesta',
    description: 'Manipulación avanzada de listas anidadas.',
    difficulty: Difficulty.HARD,
    category: Category.DATA_STRUCTURES,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `transponer(matriz)`.\n2. Convierte filas en columnas.\n3. [[1,2], [3,4]] -> [[1,3], [2,4]].',
    initialCode: 'def transponer(matriz):\n    # Intenta con List Comprehension\n    pass',
    hints: ['[[fila[i] for fila in matriz] for i in range(len(matriz[0]))]']
  },
  {
    id: 'py-028',
    title: 'Ordenamiento Burbuja',
    description: 'Implementación manual de algoritmos de ordenamiento.',
    difficulty: Difficulty.HARD,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `bubble_sort(lista)`.\n2. Ordena la lista in-place (modifica la original).\n3. Algoritmo de burbuja.',
    initialCode: 'def bubble_sort(lista):\n    n = len(lista)\n    # Doble bucle\n    pass',
    hints: ['Intercambia: lista[j], lista[j+1] = lista[j+1], lista[j]']
  },
  {
    id: 'py-029',
    title: 'Sucesión de Fibonacci',
    description: 'Generadores o listas.',
    difficulty: Difficulty.HARD,
    category: Category.ALGORITHMS,
    language: ProgrammingLanguage.PYTHON,
    instructions: '1. Función `fibonacci(n)`.\n2. Retorna una lista con los primeros n números de la sucesión.\n3. [0, 1, 1, 2, 3, ...]',
    initialCode: 'def fibonacci(n):\n    if n <= 0: return []\n    seq = [0, 1]\n    # Tu código',
    hints: ['seq.append(seq[-1] + seq[-2])']
  }
];

export const INITIAL_MOODLE_STATE = {
  isConnected: true,
  studentName: 'Coder Demo',
  courseId: 'DEV-101',
  lastGradeSent: null,
  lastGradeTime: null
};