import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, ReadOrderDto, OrderStatus } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const timestamp = Date.now().toString().slice(-4);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `TK-${dateStr}-${timestamp}`;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          shippingAddress: dto.shippingAddress,
          notes: dto.notes,
          totalAmount: dto.totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  async findAll(query: ReadOrderDto) {
    const skip = Number(query?.skip ?? 0);
    const limit = Number(query?.limit ?? 100);

    const where: any = {};
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.search) {
      where.OR = [
        { orderNumber: { contains: query.search } },
        { customerName: { contains: query.search } },
        { customerPhone: { contains: query.search } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { total, skip, limit, data: orders };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Pesanan dengan id ${id} tidak ditemukan`);
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
      });
    } catch (error: any) {
      if (error?.code === 'P2025')
        throw new NotFoundException(`Pesanan dengan id ${id} tidak ditemukan`);
      throw error;
    }
  }

  async getDashboardSummary() {
    const [
      orders,
      totalOrders,
      totalProducts,
      totalPartners,
      totalInquiries,
      unreadInquiries,
    ] = await Promise.all([
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { items: true },
      }),
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.partner.count(),
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { isRead: false } }),
    ]);

    const totalRevenue = orders.reduce((acc, curr) => {
      if (curr.status !== OrderStatus.CANCELLED) {
        return acc + Number(curr.totalAmount);
      }
      return acc;
    }, 0);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalPartners,
      totalInquiries,
      unreadInquiries,
      recentOrders: orders,
    };
  }
}
