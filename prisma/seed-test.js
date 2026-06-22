const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function dateInLastMonth(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

const nombresColombianos = [
  'Valentina Torres', 'Sebastián Gómez', 'Camila Rodríguez', 'Andrés Martínez',
  'Isabella López', 'Santiago Pérez', 'Sofía García', 'Mateo Hernández',
  'Daniela Sánchez', 'Juan Carlos Díaz', 'Mariana Vargas', 'Felipe Moreno',
  'Alejandra Castro', 'David Romero', 'Laura Jiménez', 'Miguel Ángel Ríos',
  'Natalia Herrera', 'Cristian Ruiz', 'Paola Mendoza', 'Julián Flores',
];

const telefonos = () => `+57 3${randomBetween(10, 25)}${randomBetween(1000000, 9999999)}`;

const horas = ['12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

const menuItemsData = [
  { nombre: 'Rollitos Primavera',    precio: 12900, emoji: '🥟' },
  { nombre: 'Sopa Wonton',           precio: 14900, emoji: '🍲' },
  { nombre: 'Arroz Frito Especial',  precio: 18900, emoji: '🍚' },
  { nombre: 'Chow Mein de Pollo',    precio: 19900, emoji: '🍜' },
  { nombre: 'Pato Laqueado',         precio: 42900, emoji: '🦆' },
  { nombre: 'Camarones al Wok',      precio: 32900, emoji: '🦐' },
  { nombre: 'Cerdo Agridulce',       precio: 24900, emoji: '🥩' },
  { nombre: 'Galletas de la Fortuna',precio: 4900,  emoji: '🥮' },
];

async function main() {
  console.log('🧪 Generando mes de datos de prueba...\n');

  // ── RESERVAS (45 reservas en 30 días) ──────────────────────────────────
  const estadosReserva = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'COMPLETADA', 'COMPLETADA', 'CANCELADA'];
  let reservasCreadas = 0;

  for (let dia = 30; dia >= 1; dia--) {
    const cantidad = randomBetween(0, 3);
    for (let i = 0; i < cantidad; i++) {
      const nombre = randomFrom(nombresColombianos);
      const fecha = dateInLastMonth(dia);
      await prisma.reserva.create({
        data: {
          nombreCliente: nombre,
          telefono: telefonos(),
          email: `${nombre.split(' ')[0].toLowerCase()}@gmail.com`,
          fecha,
          hora: randomFrom(horas),
          personas: randomBetween(1, 8),
          estado: randomFrom(estadosReserva),
          notas: randomFrom([null, null, null, 'Sin mariscos', 'Cumpleaños', 'Ventana preferiblemente', 'Bebé en el grupo']),
          createdAt: fecha,
          updatedAt: fecha,
        },
      });
      reservasCreadas++;
    }
  }
  console.log(`✅ ${reservasCreadas} reservas creadas`);

  // ── PEDIDOS (60 pedidos en 30 días) ────────────────────────────────────
  const estadosPedido = ['ENTREGADO', 'ENTREGADO', 'ENTREGADO', 'ENTREGADO', 'CANCELADO', 'EN_PREPARACION'];
  const tiposPedido = ['DOMICILIO', 'DOMICILIO', 'MESA'];
  let pedidosCreados = 0;

  for (let dia = 30; dia >= 1; dia--) {
    const cantidad = randomBetween(1, 4);
    for (let i = 0; i < cantidad; i++) {
      const numItems = randomBetween(1, 4);
      const items = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const item = randomFrom(menuItemsData);
        const qty = randomBetween(1, 3);
        subtotal += item.precio * qty;
        items.push({ nombre: item.nombre, precio: item.precio, cantidad: qty, emoji: item.emoji });
      }

      const tipo = randomFrom(tiposPedido);
      const delivery = tipo === 'DOMICILIO' ? 5000 : 0;
      const total = subtotal + delivery;
      const fecha = dateInLastMonth(dia);

      await prisma.pedido.create({
        data: {
          tipo,
          estado: dia <= 1 ? 'EN_PREPARACION' : randomFrom(estadosPedido),
          clienteNombre: randomFrom(nombresColombianos),
          clienteTelefono: telefonos(),
          direccion: tipo === 'DOMICILIO' ? randomFrom([
            'Calle 5 #23-10, Bocagrande',
            'Av. El Lago #45-20, Manga',
            'Cra 3 #12-50, Getsemaní',
            'Calle 30 #8-15, El Cabrero',
          ]) : null,
          items,
          subtotal,
          total,
          notas: randomFrom([null, null, 'Sin cebolla', 'Extra picante', 'Aparte la salsa']),
          createdAt: fecha,
          updatedAt: fecha,
        },
      });
      pedidosCreados++;
    }
  }
  console.log(`✅ ${pedidosCreados} pedidos creados`);

  // ── GASTOS (30 gastos en el mes) ────────────────────────────────────────
  const gastosMock = [
    { concepto: 'Compra de verduras y vegetales',   monto: 180000,  categoria: 'INGREDIENTES' },
    { concepto: 'Pollo y cerdo frescos',             monto: 320000,  categoria: 'INGREDIENTES' },
    { concepto: 'Mariscos (camarones y langostinos)',monto: 450000,  categoria: 'INGREDIENTES' },
    { concepto: 'Salsas y condimentos importados',   monto: 95000,   categoria: 'INGREDIENTES' },
    { concepto: 'Arroz y fideos por mayor',          monto: 140000,  categoria: 'INGREDIENTES' },
    { concepto: 'Factura de energía eléctrica',      monto: 380000,  categoria: 'SERVICIOS'    },
    { concepto: 'Factura de agua',                   monto: 95000,   categoria: 'SERVICIOS'    },
    { concepto: 'Internet y teléfono',               monto: 120000,  categoria: 'SERVICIOS'    },
    { concepto: 'Gas natural',                       monto: 85000,   categoria: 'SERVICIOS'    },
    { concepto: 'Nómina cocinero principal',         monto: 1200000, categoria: 'NOMINA'       },
    { concepto: 'Nómina mesero',                     monto: 950000,  categoria: 'NOMINA'       },
    { concepto: 'Nómina cajera',                     monto: 950000,  categoria: 'NOMINA'       },
    { concepto: 'Mantenimiento cocina industrial',   monto: 250000,  categoria: 'MANTENIMIENTO'},
    { concepto: 'Cambio de extractor de humos',      monto: 180000,  categoria: 'MANTENIMIENTO'},
    { concepto: 'Dominio y hosting web',             monto: 45000,   categoria: 'OTRO'         },
    { concepto: 'Empaques y bolsas domicilio',       monto: 68000,   categoria: 'OTRO'         },
  ];

  let gastosCreados = 0;
  for (let dia = 30; dia >= 1; dia -= 2) {
    const gasto = randomFrom(gastosMock);
    const fecha = dateInLastMonth(dia);
    await prisma.gasto.create({
      data: {
        concepto: gasto.concepto,
        monto: gasto.monto + randomBetween(-10000, 10000),
        categoria: gasto.categoria,
        fecha,
        createdAt: fecha,
      },
    });
    gastosCreados++;
  }
  console.log(`✅ ${gastosCreados} gastos creados`);

  // ── RESUMEN ─────────────────────────────────────────────────────────────
  const totalVentas = await prisma.pedido.aggregate({
    where: { estado: 'ENTREGADO' },
    _sum: { total: true },
  });
  const totalGastos = await prisma.gasto.aggregate({ _sum: { monto: true } });

  console.log('\n📊 Resumen del mes:');
  console.log(`   Ventas:  $${totalVentas._sum.total?.toLocaleString('es-CO') || 0}`);
  console.log(`   Gastos:  $${totalGastos._sum.monto?.toLocaleString('es-CO') || 0}`);
  console.log('\n🎉 Datos de prueba listos');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
