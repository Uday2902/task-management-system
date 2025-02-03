const { registerUser } = require('../../controllers/user');  // Adjust path to your controller
const Models = require('../../models');
const StatusCodes = require('http-status-codes');

jest.mock('../../models');

describe('registerUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'Uday Patel',
                email: 'uday10@gmail.com',
                password: 'uday10@123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return an error if user already exists', async () => {
        
        Models.User.findOne.mockResolvedValue(true);

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ message: "User already exists with this credentials!" });
    });

    it('should create a new user and return a token', async () => {
        
        Models.User.findOne.mockResolvedValue(null);

        
        const mockUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword123',
            createJWT: jest.fn().mockReturnValue('mockToken123')
        };
        Models.User.create.mockResolvedValue(mockUser);

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: "New user created successfully!",
            data: mockUser,
            token: 'mockToken123'
        });
    });

    it('should return an error if user creation fails', async () => {
        
        Models.User.findOne.mockResolvedValue(null);
        Models.User.create.mockResolvedValue(null);

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ message: "Not able to create new user account!" });
    });
});
