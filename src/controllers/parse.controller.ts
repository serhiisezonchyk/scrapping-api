import * as cheerio from 'cheerio';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { db } from '../db';
import { saveOutput } from '../utils/saveOutput';
export interface ScrappedData {
  title: string;
  role: string;
  img: string;
  socialLinks: Array<string>;
}

interface SaveOutputResponse {
  message: string;
  data: ScrappedData[];
  length: number;
  isFileSaved?: string;
}

export default class ParseController {
  async parse(req: Request, res: Response) {
    const user = req.user;
    const attempId = req.attempId;

    const link = 'https://interaction24.ixda.org/';

    const pageResp = await fetch(link);
    const text = await pageResp.text();
    const data: ScrappedData[] = [];
    const $ = cheerio.load(text);
    $('.speakers-list_list > div > div').each((index, element) => {
      const title = $(element).find('.speakers-list_item-heading').text() as string;
      const role = $(element).find('div:nth-child(2) > div:nth-child(2)').text() as string;
      const img = $(element)
        .find('.speakers-list_item-image-wrapper > img')
        .attr('src')
        ?.replace('../', link) as string;

      const socialLinks: string[] = [];
      $(element)
        .find('div:last-child > a')
        .each((index, socialLink) => {
          const href = $(socialLink).attr('href') as string;
          if (!href.includes('index.html#')) {
            socialLinks.push(href);
          }
        });
      data.push({ title, img, role, socialLinks });
    });

    const isFileSaved = await saveOutput({ email: user?.email!, attempId: attempId!, data });
    const responseObject: SaveOutputResponse = {
      message: 'Success',
      data: data,
      length: data.length,
    };
    if (isFileSaved) {
      await db.parseRequest.update({
        where: {
          id: attempId!,
        },
        data: {
          success: true,
          link: isFileSaved,
        },
      });
      responseObject.isFileSaved = isFileSaved;
    }
    res.status(StatusCodes.OK).json(responseObject);
  }
  async getUserParsedReqs(req: Request, res: Response) {
    const user = req.user;
    try {
      const data = await db.parseRequest.findMany({
        where: {
          userId: user?.id,
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
      res.status(StatusCodes.OK).json({ data: data });
    } catch (error) {}
  }
  async getParsedReqs(req: Request, res: Response) {
    try {
      const data = await db.parseRequest.findMany({
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
      res.status(StatusCodes.OK).json({ data: data });
    } catch (error) {}
  }
}
