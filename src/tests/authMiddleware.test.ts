import authMiddleware from "../middlewares/authMiddleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ✅ Mock de `jsonwebtoken`
jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let validToken: string;
    let invalidToken: string;

    beforeAll(() => {
        // ✅ Définit une valeur par défaut si JWT_SECRET est absent
        process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
    });

    beforeEach(() => {
        req = {
            headers: {}
        } as Partial<Request>;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<Response>;

        next = jest.fn();

        validToken = "mocked_valid_token";
        invalidToken = "mocked_invalid_token";

        // ✅ Mock de `jwt.sign`
        (jwt.sign as jest.Mock).mockReturnValue(validToken);

        // ✅ Mock de `jwt.verify`
        (jwt.verify as jest.Mock).mockImplementation((token) => {
            if (token === validToken) {
                return { userId: "67ab1abe5905025733f3661f", role: "api_client" };
            } else {
                throw new Error("Invalid token");
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Devrait refuser une requête avec un token manquant", () => {
        req.headers = {};
        authMiddleware(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Accès non autorisé : Token manquant" });
        expect(next).not.toHaveBeenCalled();
    });

    it("Devrait refuser une requête avec un token invalide", () => {
        req.headers = { authorization: `Bearer ${invalidToken}` };

        authMiddleware(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Accès non autorisé : Token invalide" });
        expect(next).not.toHaveBeenCalled();
    });

    it("Devrait autoriser la requête avec un token valide", () => {
        req.headers = { authorization: `Bearer ${validToken}` };

        authMiddleware(req as Request, res as Response, next as NextFunction);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("Devrait refuser une requête si le token est expiré", () => {
        req.headers = { authorization: `Bearer ${validToken}` };

        // ✅ Simule une erreur de token expiré
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error("jwt expired");
        });

        authMiddleware(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Accès non autorisé : Token invalide" });
        expect(next).not.toHaveBeenCalled();
    });

    it("Devrait refuser une requête si le token a un format incorrect", () => {
        req.headers = { authorization: "InvalidFormat" };

        authMiddleware(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Accès non autorisé : Format de token incorrect" });
        expect(next).not.toHaveBeenCalled();
    });
});
