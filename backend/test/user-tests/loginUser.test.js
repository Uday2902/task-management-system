const { loginUser } = require('../../controllers/user');
const Models = require('../../models');
const StatusCodes = require('http-status-codes');
jest.mock('../../models');

describe('loginUser Controller', () => {
    
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                mongoID: null,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return an error if mongoID is provided and user not found', async () => {
        req.body.mongoID = 'nonexistentID';
        Models.User.findOne.mockResolvedValue(null);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ message: "Not able to find user" });
    });

    it('should return error if user is not found by email', async () => {
        Models.User.findOne.mockResolvedValue(null); // Mock no user found

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid password" });
    });

    it('should return error if password is incorrect', async () => {
        const mockUser = { _id: 'userId', email: 'test@example.com', password: 'hashedPassword', comparePassword: jest.fn().mockResolvedValue(false) };
        Models.User.findOne.mockResolvedValue(mockUser); // Mock user found

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ message: "Incorrect password!" });
    });

    it('should return user and token if password is correct', async () => {
        const mockUser = {
            _id: 'userId',
            email: 'test@example.com',
            password: 'hashedPassword',
            comparePassword: jest.fn().mockResolvedValue(true),
            createJWT: jest.fn().mockReturnValue('mockToken'),
            toObject: jest.fn().mockReturnValue({ _id: 'userId', email: 'test@example.com' }),
        };

        Models.User.findOne.mockResolvedValue(mockUser);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: "User found with given credentials",
            user: { _id: 'userId', email: 'test@example.com' },
            token: 'mockToken',
        });
    });
});
