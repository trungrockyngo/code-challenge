import { Request, Response, Router } from 'express';
import { UserService, NotFoundError, ConflictError } from '../services/user.service';
import { ZodError } from 'zod';

export function createUserController(userService: UserService): Router {
  const router = Router();

  const handleError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation Failure',
        details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error instanceof ConflictError) {
      return res.status(409).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  };

  router.post('/', async (req: Request, res: Response) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      handleError(err, res);
    }
  });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const result = await userService.listUsers(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      handleError(err, res);
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      handleError(err, res);
    }
  });

  router.patch('/:id', async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      handleError(err, res);
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  });

  return router;
}